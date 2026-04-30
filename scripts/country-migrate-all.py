#!/usr/bin/env python3
"""Master orchestrator for the 49-country WP-to-Strapi migration.

For each country in the queue:
  1. Discover blog + service URLs (carelabz.com/{cc}/...)
  2. Run Playwright scrape (blog + service, in parallel)
  3. Shape HTML to Strapi payloads
  4. Upload hero images to Strapi media
  5. POST/enrich entries in Strapi (preserves SEO fields)

Per-country status persisted to data/migration-progress.json so the run is
resumable. Failures in one country never block the others.

Usage:
  python3 scripts/country-migrate-all.py [--countries cc1,cc2,...] [--skip-done]
"""

import os, sys, json, time, subprocess, datetime
from pathlib import Path

PROGRESS = Path("data/migration-progress.json")
LOG_DIR = Path("data/migration-logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

DONE_COUNTRIES = {"ae", "uk"}

STEPS = ["discover", "scrape_blog", "scrape_service", "shape_blog", "shape_service",
         "upload_blog_heroes", "upload_service_heroes", "post_blog", "post_service"]


def now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def load_progress() -> dict:
    if PROGRESS.exists():
        return json.loads(PROGRESS.read_text(encoding="utf-8"))
    return {}


def save_progress(p: dict):
    PROGRESS.write_text(json.dumps(p, indent=2), encoding="utf-8")


def list_countries() -> list[str]:
    audits = json.loads(Path("data/wp-country-availability.json").read_text(encoding="utf-8"))["audits"]
    return sorted([
        cc for cc, a in audits.items()
        if a.get("probes", {}).get("homepage", {}).get("status", 0) < 400
        and cc not in DONE_COUNTRIES
    ])


def run_step(cc: str, step: str, cmd: list[str], log_path: Path, env: dict | None = None,
             timeout: int = 1800) -> tuple[bool, str]:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    full_env = os.environ.copy()
    if env:
        full_env.update(env)
    print(f"  [{cc}] {step:25s}...", flush=True, end=" ")
    t0 = time.time()
    try:
        with open(log_path, "w", encoding="utf-8") as f:
            r = subprocess.run(cmd, stdout=f, stderr=subprocess.STDOUT, env=full_env, timeout=timeout)
        elapsed = time.time() - t0
        if r.returncode == 0:
            print(f"OK ({elapsed:.0f}s)", flush=True)
            return True, ""
        print(f"FAIL rc={r.returncode} ({elapsed:.0f}s)", flush=True)
        return False, f"rc={r.returncode}"
    except subprocess.TimeoutExpired:
        print(f"TIMEOUT after {timeout}s", flush=True)
        return False, "timeout"
    except Exception as e:
        print(f"ERROR {e}", flush=True)
        return False, str(e)


def migrate_country(cc: str, progress: dict, only_step: str | None = None):
    print(f"\n=== {cc.upper()} ===  start {now_iso()}", flush=True)
    state = progress.setdefault(cc, {"steps": {}, "started": now_iso()})
    state["last_attempt"] = now_iso()

    log_dir = LOG_DIR / cc
    log_dir.mkdir(parents=True, exist_ok=True)

    def step_done(name): return state["steps"].get(name, {}).get("ok") is True
    def mark(name, ok, err=""):
        state["steps"][name] = {"ok": ok, "err": err, "at": now_iso()}
        save_progress(progress)

    # 1. Discover
    if not step_done("discover"):
        ok, err = run_step(cc, "discover", ["python3", "scripts/country-wp-discover.py", cc],
                           log_dir / "discover.log", timeout=600)
        mark("discover", ok, err)
        if not ok:
            return
    blog_urls = Path(f"data/{cc}/wp-blog-urls.txt")
    service_urls = Path(f"data/{cc}/wp-service-urls.txt")

    # Dedupe blog vs service
    if blog_urls.exists() and service_urls.exists():
        s_set = set(service_urls.read_text(encoding="utf-8").splitlines())
        b_lines = blog_urls.read_text(encoding="utf-8").splitlines()
        deduped = [l for l in b_lines if l.strip() and l not in s_set]
        if len(deduped) != len(b_lines):
            blog_urls.write_text("\n".join(deduped) + "\n", encoding="utf-8")

    # 2. Scrape (blog + service in parallel)
    procs = []
    for kind in ["blog", "service"]:
        url_file = Path(f"data/{cc}/wp-{kind}-urls.txt")
        if not url_file.exists() or not url_file.read_text().strip():
            mark(f"scrape_{kind}", True, "no urls")
            continue
        if step_done(f"scrape_{kind}"):
            continue
        log = log_dir / f"scrape_{kind}.log"
        env = os.environ.copy()
        env["CC"] = cc
        env["KIND"] = kind
        f = open(log, "w", encoding="utf-8")
        p = subprocess.Popen(
            ["npx", "playwright", "test", "tests/country-wp-scrape.spec.ts", "--reporter=list"],
            stdout=f, stderr=subprocess.STDOUT, env=env, shell=True,
        )
        procs.append((kind, p, f))

    for kind, p, f in procs:
        try:
            rc = p.wait(timeout=3000)
            f.close()
            mark(f"scrape_{kind}", rc == 0, f"rc={rc}" if rc != 0 else "")
        except subprocess.TimeoutExpired:
            p.kill()
            f.close()
            mark(f"scrape_{kind}", False, "timeout")

    # 3. Shape
    for kind in ["blog", "service"]:
        if step_done(f"shape_{kind}"):
            continue
        if not state["steps"].get(f"scrape_{kind}", {}).get("ok"):
            mark(f"shape_{kind}", False, "skipped (scrape failed)")
            continue
        ok, err = run_step(cc, f"shape_{kind}",
                           ["python3", "scripts/country-shape-scraped.py", cc, kind],
                           log_dir / f"shape_{kind}.log", timeout=300)
        mark(f"shape_{kind}", ok, err)

    # 4. Upload heroes
    for kind in ["blog", "service"]:
        if step_done(f"upload_{kind}_heroes"):
            continue
        if not state["steps"].get(f"shape_{kind}", {}).get("ok"):
            mark(f"upload_{kind}_heroes", False, "skipped (shape failed)")
            continue
        ok, err = run_step(cc, f"upload_{kind}_heroes",
                           ["python3", "-u", "scripts/country-upload-hero-images.py", cc, kind],
                           log_dir / f"upload_{kind}.log", timeout=900)
        mark(f"upload_{kind}_heroes", ok, err)

    # 5. POST
    for kind in ["blog", "service"]:
        if step_done(f"post_{kind}"):
            continue
        if not state["steps"].get(f"shape_{kind}", {}).get("ok"):
            mark(f"post_{kind}", False, "skipped (shape failed)")
            continue
        ok, err = run_step(cc, f"post_{kind}",
                           ["python3", "-u", "scripts/country-post.py", cc, kind],
                           log_dir / f"post_{kind}.log", timeout=900)
        mark(f"post_{kind}", ok, err)

    state["completed"] = now_iso()
    save_progress(progress)
    print(f"=== {cc.upper()} done ===", flush=True)


def main():
    args = sys.argv[1:]
    countries = list_countries()
    only = None
    if "--countries" in args:
        idx = args.index("--countries")
        only = args[idx + 1].split(",")
        countries = [c for c in countries if c in only]

    progress = load_progress()
    print(f"Migration queue ({len(countries)}): {' '.join(countries)}", flush=True)
    print(f"Logs: {LOG_DIR}/{{cc}}/*.log", flush=True)
    print(f"Progress: {PROGRESS}", flush=True)

    t_start = time.time()
    for i, cc in enumerate(countries, 1):
        print(f"\n[{i}/{len(countries)}] -- elapsed {(time.time()-t_start)/60:.1f}m", flush=True)
        try:
            migrate_country(cc, progress)
        except Exception as e:
            print(f"  [{cc}] FATAL {e}", flush=True)
            progress[cc] = progress.get(cc, {})
            progress[cc]["fatal"] = str(e)
            save_progress(progress)

    print(f"\nAll done. Total elapsed: {(time.time()-t_start)/60:.1f}m", flush=True)
    save_progress(progress)


if __name__ == "__main__":
    main()
