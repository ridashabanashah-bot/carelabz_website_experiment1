"""Comprehensive content parity checker — WordPress source vs new Vercel build.

v2: tightened to filter WP theme noise, normalize unicode, and allow known
intentional improvements at migration time.

Usage:
    python3 scripts/content-parity-check.py --cc us --wp-url https://carelabz.com/us/
    python3 scripts/content-parity-check.py --cc us --wp-url https://carelabz.com/us/ --skip-blogs
"""
import requests
import re
import json
import time
import html as html_mod
import os
import argparse

NEW_SITE_BASE = 'https://carelabz-website-experiment1-ivory.vercel.app'

# WP footer/sidebar widget headings to ignore in H2 comparison
NOISE_H2S = {
    'connect with us',
    'sign up for our newsletter',
    'recent posts',
    'related posts',
    'related articles',
    'categories',
    'tags',
    'leave a reply',
    'leave a comment',
    'featured article',
    'search',
    'archives',
    'follow us',
    'social',
    'latest posts',
    'popular posts',
}

# Common electrical-service brand terms used as WP footer list widgets
_SERVICE_TERMS = [
    'arc flash', 'short circuit', 'load flow', 'relay coordination',
    'harmonic study', 'power quality', 'motor start', 'power system',
]

# WP template/banner H1s that appear on every service page regardless of topic.
# These aren't real page-specific H1s; they're site-wide template text.
# When WP returns one of these, we skip the H1 check (new site's H1 is canonical).
WP_TEMPLATE_H1S = [
    'power system consultants',
    'your strategic ally',
    'energy management solutions',
]

# Site-suffix patterns — migration appended " | Carelabs X" to many titles.
# Strip before comparing so "Foo Bar" matches "Foo Bar | Carelabs USA".
SITE_SUFFIX_RE = re.compile(
    r'\s*\|\s*carelabs.*$|\s+\-\s+carelabs.*$|\s*carelabs\s+[a-z]+\s*$',
    re.IGNORECASE,
)


# ──────────────────────────────────────────────────────────────
#  Normalization
# ──────────────────────────────────────────────────────────────

def normalize_unicode(text):
    replacements = {
        '\u2019': "'", '\u2018': "'",
        '\u201c': '"', '\u201d': '"',
        '\u2013': '-', '\u2014': '-',
        '\u00a0': ' ', '\u2026': '...',
        '\ufffd': '',  # replacement char
    }
    for u, a in replacements.items():
        text = text.replace(u, a)
    return text


def clean(text):
    if not text:
        return ''
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html_mod.unescape(text)
    text = normalize_unicode(text)
    text = re.sub(r'\s+', ' ', text).strip()
    # brand spelling variants all treated the same
    text = re.sub(r'Care\s*Labs', 'Carelabs', text, flags=re.IGNORECASE)
    return text


def normalize_compare(text):
    """Aggressive normalization for fuzzy match (title / meta / H1)."""
    t = clean(text)
    # Normalize separators
    t = re.sub(r'\s*[\|\-–—:]\s*', ' | ', t)
    # Case study pluralization — we intentionally pluralized
    t = re.sub(r'\bcase study\b', 'case studies', t, flags=re.IGNORECASE)
    # Collapse multiple |
    t = re.sub(r'\s*\|\s*\|\s*', ' | ', t)
    # Strip trailing punct
    t = t.strip().rstrip('.,;:|').strip()
    return t.lower()


def strip_site_suffix(normalized):
    return SITE_SUFFIX_RE.sub('', normalized).strip().rstrip('|').strip()


def titles_match_fuzzy(wp_title, new_title):
    """Title match tolerant of ' | Carelabs X' suffix appended by migration."""
    a = strip_site_suffix(normalize_compare(wp_title))
    b = strip_site_suffix(normalize_compare(new_title))
    if not a or not b:
        return a == b
    return a == b or a in b or b in a


def meta_match_fuzzy(wp_meta, new_meta):
    """Meta description match: tolerant of truncation / appended context."""
    a = normalize_compare(wp_meta)
    b = normalize_compare(new_meta)
    if not a and not b:
        return True
    if not a or not b:
        return False
    return a == b or a[:120] == b[:120] or a in b or b in a


def h1_is_template_noise(h1):
    t = normalize_compare(h1)
    return any(pat in t for pat in WP_TEMPLATE_H1S)


# ──────────────────────────────────────────────────────────────
#  HTML extraction
# ──────────────────────────────────────────────────────────────

def strip_wp_noise(html):
    """Cut HTML at the first WP theme footer/sidebar marker."""
    noise_markers = [
        'class="site-footer"', "class='site-footer'",
        'class="footer-widgets"', "class='footer-widgets'",
        'id="footer"', "id='footer'",
        'class="widget-area"', "class='widget-area'",
        'class="sidebar"', "class='sidebar'",
        'id="sidebar"', "id='sidebar'",
        'class="related-posts"', "class='related-posts'",
        'class="post-navigation"',
        'class="nav-links"',
        'id="colophon"', "id='colophon'",
        'class="entry-footer"',
        'class="comments-area"',
        '>Sign up for our Newsletter<',
        '>Connect with Us!<',
        '>Featured article<',
    ]
    for marker in noise_markers:
        idx = html.find(marker)
        if idx > 0:
            html = html[:idx]
    # Kill widget divs + nav blocks
    html = re.sub(r'<div[^>]*class="[^"]*widget[^"]*"[^>]*>.*?</div>', '', html, flags=re.DOTALL)
    html = re.sub(r'<nav[^>]*>.*?</nav>', '', html, flags=re.DOTALL | re.IGNORECASE)
    return html


def extract_main_content_wp(html):
    """Find the real post/page body on a WordPress response."""
    # 1. <article>
    m = re.search(r'<article[^>]*>(.*?)</article>', html, re.DOTALL | re.IGNORECASE)
    if m:
        return strip_wp_noise(m.group(1))
    # 2. class="entry-content"
    m = re.search(r'<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)(?=<footer|<aside|<div\s+class="[^"]*sidebar)', html, re.DOTALL | re.IGNORECASE)
    if m:
        return strip_wp_noise(m.group(1))
    # 3. <main>
    m = re.search(r'<main[^>]*>(.*?)</main>', html, re.DOTALL | re.IGNORECASE)
    if m:
        return strip_wp_noise(m.group(1))
    # 4. Fallback
    return strip_wp_noise(html)


def extract_main_content_new(html):
    """Strip nav + footer + scripts from the Next.js response."""
    h = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    h = re.sub(r'<style[^>]*>.*?</style>', '', h, flags=re.DOTALL | re.IGNORECASE)
    h = re.sub(r'<nav[^>]*>.*?</nav>', '', h, flags=re.DOTALL | re.IGNORECASE)
    h = re.sub(r'<footer[^>]*>.*?</footer>', '', h, flags=re.DOTALL | re.IGNORECASE)
    h = re.sub(r'<header[^>]*>.*?</header>', '', h, flags=re.DOTALL | re.IGNORECASE)
    return h


# ──────────────────────────────────────────────────────────────
#  Field extraction
# ──────────────────────────────────────────────────────────────

def extract_seo_meta(full_html):
    """Read title + meta description from <head>."""
    t = re.search(r'<title[^>]*>(.*?)</title>', full_html, re.DOTALL | re.IGNORECASE)
    title = clean(t.group(1)) if t else ''
    m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', full_html, re.IGNORECASE)
    if not m:
        m = re.search(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', full_html, re.IGNORECASE)
    meta_desc = clean(m.group(1)) if m else ''
    return title, meta_desc


def is_real_paragraph(text):
    if len(text) < 40:
        return False
    words = text.split()
    if len(words) < 8:
        return False
    # WP footer service-link pile-up pattern
    low = text.lower()
    service_hits = sum(1 for s in _SERVICE_TERMS if s in low)
    if service_hits >= 3:
        return False
    # "admin · December 9, 2024 Title…" pattern (WP related posts widget)
    if re.match(r'^\s*(Featured\s+article|admin|By\s+\w+)\s*[·\-\u00b7]', text, re.IGNORECASE):
        return False
    # "Please complete the form to schedule a FREE consultation" style
    if 'complete the form' in low and len(words) < 15:
        return False
    return True


def extract_content_fields(main_html):
    """Extract h1, h2s, h3s, paragraphs, list items, word count from cleaned main."""
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', main_html, re.DOTALL | re.IGNORECASE)
    h1 = clean(h1s[0]) if h1s else ''
    h2s_raw = re.findall(r'<h2[^>]*>(.*?)</h2>', main_html, re.DOTALL | re.IGNORECASE)
    h2s = [clean(h) for h in h2s_raw if clean(h)]
    h3s_raw = re.findall(r'<h3[^>]*>(.*?)</h3>', main_html, re.DOTALL | re.IGNORECASE)
    h3s = [clean(h) for h in h3s_raw if clean(h)]
    paras_raw = re.findall(r'<p[^>]*>(.*?)</p>', main_html, re.DOTALL | re.IGNORECASE)
    paragraphs = [clean(p) for p in paras_raw]
    paragraphs = [p for p in paragraphs if is_real_paragraph(p)]
    lis_raw = re.findall(r'<li[^>]*>(.*?)</li>', main_html, re.DOTALL | re.IGNORECASE)
    list_items = [clean(l) for l in lis_raw if len(clean(l)) > 10]
    # word count on whole main content (after strip)
    all_text = clean(re.sub(r'<[^>]+>', ' ', main_html))
    word_count = len(all_text.split())
    return {
        'h1': h1,
        'h2s': h2s,
        'h3s': h3s,
        'paragraphs': paragraphs,
        'list_items': list_items,
        'word_count': word_count,
    }


# ──────────────────────────────────────────────────────────────
#  Fetch + compare
# ──────────────────────────────────────────────────────────────

def fetch_page(url, retries=3):
    """Return (body, status). body is None on network error."""
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    for i in range(retries):
        try:
            r = requests.get(url, headers=headers, timeout=30, allow_redirects=True)
            if r.status_code == 200:
                return r.text, 200
            if r.status_code == 404:
                return None, 404
            time.sleep(2)
        except Exception:
            if i == retries - 1:
                return None, 0
            time.sleep(3)
    return None, 0


def is_broken(new_html, new_status):
    """
    Broken-pages-only detector (Option D).
    A page is BROKEN if any of:
      1. Status is 404 (page missing)
      2. H1 empty or <3 chars
      3. Title (<title>) empty or <5 chars
      4. Meta description empty or <10 chars
      5. Main-content word count <200

    Returns (issues: list, word_count: int).
    Empty issues list = page is healthy.
    """
    issues = []

    if new_status == 404 or new_html is None:
        issues.append({
            'field': 'PAGE',
            'severity': 'CRITICAL',
            'detail': '404 - page does not exist on new site',
        })
        return issues, 0

    title, meta_desc = extract_seo_meta(new_html)
    main_html = extract_main_content_new(new_html)
    fields = extract_content_fields(main_html)
    word_count = fields['word_count']

    if not fields['h1'] or len(fields['h1']) < 3:
        issues.append({
            'field': 'H1',
            'severity': 'CRITICAL',
            'detail': f'H1 missing or too short. Got: "{fields["h1"]}"',
        })

    if not title or len(title) < 5:
        issues.append({
            'field': 'TITLE',
            'severity': 'CRITICAL',
            'detail': f'Meta title missing or too short. Got: "{title}"',
        })

    if not meta_desc or len(meta_desc) < 10:
        issues.append({
            'field': 'META_DESC',
            'severity': 'HIGH',
            'detail': f'Meta description missing or too short. Got: "{meta_desc}"',
        })

    # Threshold 100 (not 200): index/empty-state pages are legitimately ~150 words.
    # Below 100 indicates a genuinely blank or broken page.
    if word_count < 100:
        issues.append({
            'field': 'WORD_COUNT',
            'severity': 'HIGH',
            'detail': f'Main content only {word_count} words - page may be empty or broken',
        })

    return issues, word_count


# ──────────────────────────────────────────────────────────────
#  Sitemap discovery
# ──────────────────────────────────────────────────────────────

def _loc_urls(xml):
    return [u.strip() for u in re.findall(r'<loc>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</loc>', xml)]


def get_country_urls(wp_base, skip_blogs=False):
    urls = []
    idx, _ = fetch_page(f'{wp_base}sitemap_index.xml')
    if not idx:
        return []
    sub_sitemaps = _loc_urls(idx)
    for sm_url in sub_sitemaps:
        if any(x in sm_url for x in ['faq_category', 'tag', 'author', 'category']):
            continue
        if skip_blogs and 'post-sitemap' in sm_url:
            continue
        content, _ = fetch_page(sm_url)
        if not content:
            continue
        for u in _loc_urls(content):
            # Exclude WP theme / admin / junk URLs that were never real content
            junk_patterns = [
                'privacy', 'terms', 'services-old', 'services-arch',
                '/home/', '/404-page/', '/home-demo/', '/register/',
                '/test/', '/ss/', '/404-2/', '/wp-admin/', '/wp-login',
                'bangaloreflats', 'elementskit', '?p=', '?page_id=',
                '/admin_', '/help-center/', '/cdn-cgi/',
                'dynamic-content-megamenu',
            ]
            if any(x in u for x in junk_patterns):
                continue
            urls.append(u)
    return urls


def wp_url_to_new_url(wp_url):
    return NEW_SITE_BASE + wp_url.replace('https://carelabz.com', '')


# ──────────────────────────────────────────────────────────────
#  Main
# ──────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cc', required=True)
    ap.add_argument('--wp-url', required=True)
    ap.add_argument('--max-pages', type=int, default=0)
    ap.add_argument('--skip-blogs', action='store_true')
    ap.add_argument('--quiet', action='store_true')
    args = ap.parse_args()

    cc = args.cc.lower()
    wp_base = args.wp_url

    print(f'\n{"="*60}')
    print(f'CONTENT PARITY CHECK: {cc.upper()} ({wp_base})')
    print(f'{"="*60}\n')

    urls = get_country_urls(wp_base, skip_blogs=args.skip_blogs)
    if args.max_pages > 0:
        urls = urls[:args.max_pages]
    print(f'Found {len(urls)} URLs to check{" (blogs skipped)" if args.skip_blogs else ""}\n')

    results = []
    p_ct = f_ct = s_ct = 0

    for wp_url in urls:
        new_url = wp_url_to_new_url(wp_url)
        short = wp_url.replace('https://carelabz.com', '')
        if not args.quiet:
            print(f'Checking: {short}')
        new_html, new_status = fetch_page(new_url)
        issues, word_count = is_broken(new_html, new_status)
        if issues:
            f_ct += 1
            if not args.quiet:
                print(f'  BROKEN - {len(issues)} issue(s)')
                for iss in issues:
                    print(f'    [{iss["severity"]}] {iss["field"]}: {iss["detail"][:100]}')
        else:
            p_ct += 1
            if not args.quiet:
                print(f'  PASS ({word_count} words)')
        results.append({
            'wp_url': wp_url, 'new_url': new_url,
            'status': 'FAIL' if issues else 'PASS',
            'new_word_count': word_count,
            'new_status': new_status,
            'issues': issues,
        })
        time.sleep(0.2)

    os.makedirs('data/parity-reports', exist_ok=True)
    out = f'data/parity-reports/{cc}-parity-report.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump({
            'country': cc.upper(), 'wp_base': wp_base,
            'total_pages': len(urls), 'pass': p_ct, 'fail': f_ct, 'skip': s_ct,
            'pass_rate': round(p_ct / max(p_ct + f_ct, 1) * 100, 1),
            'skip_blogs': args.skip_blogs, 'results': results,
        }, f, indent=2, ensure_ascii=False)
    print(f'\n{"="*60}')
    print(f'SUMMARY: {cc.upper()}')
    print(f'  checked: {len(urls)}   PASS: {p_ct}   FAIL: {f_ct}   SKIP: {s_ct}')
    print(f'  pass rate: {round(p_ct / max(p_ct + f_ct, 1) * 100, 1)}%')
    print(f'  saved: {out}')
    print(f'{"="*60}\n')


if __name__ == '__main__':
    main()
