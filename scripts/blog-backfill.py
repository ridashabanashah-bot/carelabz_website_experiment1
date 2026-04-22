"""Blog-only backfill for a country.

Scrapes all blog-post URLs from WordPress (no cap) and uploads any missing
entries to Strapi with slug `${raw_slug}-${cc}` and region=cc. Safe to re-run
— existing entries are skipped (not overwritten).

Usage:
    python3 scripts/blog-backfill.py --cc mx
"""
from __future__ import annotations

import argparse
import copy
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from bs4 import BeautifulSoup

STRAPI_URL = 'https://rational-cheese-8e8c4f80ea.strapiapp.com'


def load_token():
    with open('.env.local', encoding='utf-8') as f:
        for line in f:
            if line.startswith('STRAPI_API_TOKEN='):
                return line.split('=', 1)[1].strip().strip('"').strip("'")
    raise RuntimeError('STRAPI_API_TOKEN missing')


def http(method: str, path: str, token: str, body: dict | None = None) -> dict:
    req_body = json.dumps({'data': body}).encode('utf-8') if body else None
    headers = {'Authorization': f'Bearer {token}'}
    if req_body:
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(STRAPI_URL + path, data=req_body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.read().decode("utf-8","replace")[:150]}'}


def fetch(url: str):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 Carelabs-Backfill/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception:
        return None


def sitemap_loc_urls(xml: str) -> list[str]:
    return [u.strip() for u in re.findall(r'<loc>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</loc>', xml) if u.strip()]


def discover_wp_blog_urls(cc: str) -> list[str]:
    base = f'https://carelabz.com/{cc}/'
    idx = fetch(base + 'sitemap_index.xml')
    if not idx:
        return []
    urls = []
    for sm in sitemap_loc_urls(idx):
        if 'post-sitemap' not in sm:
            continue
        content = fetch(sm)
        if not content:
            continue
        for u in sitemap_loc_urls(content):
            # Skip the blog index page itself + junk
            if u.count('/') <= 4:
                continue
            if any(x in u for x in ['bangaloreflats', 'elementskit', 'dynamic-content',
                                     '?p=', '?page_id=', '/admin_', '/help-center/',
                                     '/404-2/', '/register/', '/test/']):
                continue
            urls.append(u)
    # Deduplicate
    return list(dict.fromkeys(urls))


def slug_from_url(url: str, cc: str) -> str:
    clean = url.split('?')[0].split('#')[0]
    m = re.search(rf'/{cc}/(.*?)/?$', clean)
    raw = m.group(1).strip('/').split('/')[-1] if m else ''
    raw = re.sub(r'[^a-zA-Z0-9\-_]', '', raw)
    return raw


def clean_text(s: str) -> str:
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\bCare\s+Labs\b', 'Carelabs', s)
    s = re.sub(r'\bCareLabs\b', 'Carelabs', s)
    return s


def scrape_wp_page(url: str) -> dict | None:
    html = fetch(url)
    if not html:
        return None
    soup = BeautifulSoup(html, 'lxml')
    title_el = soup.title
    title = clean_text(title_el.string) if title_el and title_el.string else ''
    md = soup.find('meta', attrs={'name': 'description'})
    desc = clean_text(md['content']) if md and md.get('content') else ''
    h1 = soup.find('h1')
    h1_text = clean_text(h1.get_text(' ', strip=True)) if h1 else ''

    # Main content — prefer <article>, fallback to <main>, then body minus nav/footer
    main = None
    for sel in ['article', 'main', '.entry-content', '#content']:
        el = soup.select_one(sel)
        if el:
            main = el
            break
    if main is None:
        main = soup.body or soup
    # Strip noise
    for junk in main.select('nav, footer, header, script, style, .site-footer, .site-header, .widget, .sidebar, .related-posts'):
        junk.decompose()

    paras = []
    for p in main.find_all('p'):
        t = clean_text(p.get_text(' ', strip=True))
        if len(t) > 40 and 'arc flash' not in t.lower()[:30]:
            paras.append(t)
    body_text = '\n\n'.join(paras[:25])
    return {
        'title': title,
        'meta_desc': desc,
        'h1': h1_text,
        'body': body_text,
        'paragraphs': paras,
    }


def infer_category(title: str, body: str) -> str:
    t = (title + ' ' + body[:500]).lower()
    if 'arc flash' in t:
        return 'Arc Flash Safety'
    if 'short circuit' in t:
        return 'Short Circuit Analysis'
    if 'load flow' in t:
        return 'Load Flow Analysis'
    if 'relay' in t or 'microgrid' in t:
        return 'Relay Coordination'
    if 'power quality' in t or 'harmonic' in t:
        return 'Power Quality'
    if 'motor' in t:
        return 'Motor Analysis'
    if 'ppe' in t or 'protective' in t:
        return 'Worker Safety'
    return 'Electrical Engineering'


STRIP = {'id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale', 'localizations'}


def deep_strip_id(o):
    if isinstance(o, dict):
        return {k: deep_strip_id(v) for k, v in o.items() if k != 'id'}
    if isinstance(o, list):
        return [deep_strip_id(i) for i in o]
    return o


def load_ref():
    p = 'data/strapi-refs/blog-us.json'
    if not os.path.exists(p):
        return {}
    with open(p, encoding='utf-8') as f:
        d = json.load(f).get('data', [])
    return d[0] if d else {}


def run(cc: str):
    token = load_token()
    us_ref = load_ref()
    country_name = cc.upper()

    wp_urls = discover_wp_blog_urls(cc)
    print(f'[{cc}] WP blog URLs discovered: {len(wp_urls)}')
    if not wp_urls:
        return {'cc': cc, 'wp': 0, 'existed': 0, 'created': 0, 'failed': 0}

    # Pull existing slugs for this region in one shot
    existing_slugs = set()
    page = 1
    while True:
        r = http('GET', f'/api/blog-posts?filters[region][$eq]={cc}&pagination[page]={page}&pagination[pageSize]=100&fields[0]=slug', token)
        data = r.get('data', [])
        if not data:
            break
        for e in data:
            existing_slugs.add(e.get('slug', ''))
        if len(data) < 100:
            break
        page += 1
    print(f'[{cc}] existing Strapi slugs: {len(existing_slugs)}')

    created = existed = failed = 0
    errs = []
    for wp_url in wp_urls:
        raw_slug = slug_from_url(wp_url, cc)
        if not raw_slug:
            continue
        namespaced_slug = f'{raw_slug}-{cc}'
        if raw_slug in existing_slugs or namespaced_slug in existing_slugs:
            existed += 1
            continue
        scraped = scrape_wp_page(wp_url)
        if not scraped or not scraped['title']:
            failed += 1
            errs.append(('scrape_empty', wp_url))
            continue
        payload = {k: v for k, v in copy.deepcopy(us_ref).items() if k not in STRIP} if us_ref else {}
        payload.update({
            'region': cc,
            'slug': namespaced_slug,
            'title': scraped['h1'] or scraped['title'][:100],
            'metaTitle': scraped['title'][:60],
            'metaDescription': scraped['meta_desc'][:200] if scraped['meta_desc'] else (scraped['paragraphs'][0][:160] if scraped['paragraphs'] else f"Carelabs insights on electrical safety and power system engineering — {country_name}."),
            'excerpt': (scraped['paragraphs'][0] if scraped['paragraphs'] else scraped['meta_desc'])[:250],
            'body': scraped['body'],
            'author': 'Carelabs Engineering Team',
            'category': infer_category(scraped['title'], scraped['body']),
            'publishedDate': '2024-01-15',
            'heroImage': '',
            'heroImageAlt': f'{scraped["h1"] or scraped["title"]} - Carelabs {country_name}',
            'seoKeywords': ['electrical safety', 'Carelabs', 'arc flash study'],
            'tags': [country_name, 'Electrical Safety'],
            'faqs': [],
            'relatedPosts': [],
        })
        payload = deep_strip_id(payload)
        r = http('POST', '/api/blog-posts', token, payload)
        if 'error' in r:
            failed += 1
            errs.append((raw_slug, r['error'][:120]))
        else:
            created += 1
        # small jitter to avoid Strapi rate-limit
        time.sleep(0.2)

    summary = {'cc': cc, 'wp': len(wp_urls), 'existed': existed, 'created': created, 'failed': failed}
    print(f'[{cc}] result: {summary}')
    for tag, err in errs[:3]:
        print(f'    FAIL {tag}: {err}')
    return summary


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--cc', required=True)
    args = ap.parse_args()
    run(args.cc)
