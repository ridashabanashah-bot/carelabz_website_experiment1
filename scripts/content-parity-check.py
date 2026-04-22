"""Comprehensive content parity checker — WordPress source vs new Vercel build.

Usage: python3 scripts/content-parity-check.py --cc us --wp-url https://carelabz.com/us/

Compares title, meta description, H1, H2s, paragraphs, word count, list items,
FAQs between WP and the new site. Emits data/parity-reports/{cc}-parity-report.json.
"""
import requests
import re
import json
import time
import sys
import html as html_mod
from urllib.parse import urljoin


def clean(text):
    """Normalize text for comparison"""
    if not text:
        return ''
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Decode HTML entities (&amp;, &#039;, etc.)
    text = html_mod.unescape(text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Normalize Carelabs spelling variations - all count as same
    text = re.sub(r'Care\s*Labs', 'Carelabs', text, flags=re.IGNORECASE)
    text = re.sub(r'CareLabs', 'Carelabs', text)
    text = re.sub(r'CARELABS', 'Carelabs', text, flags=re.IGNORECASE)
    return text


def extract_meta(html, url):
    """Extract all SEO and content fields from HTML"""
    data = {}

    # Title tag
    t = re.search(r'<title[^>]*>(.*?)</title>', html, re.DOTALL | re.IGNORECASE)
    data['title'] = clean(t.group(1)) if t else ''

    # Meta description
    m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', html, re.IGNORECASE)
    if not m:
        m = re.search(r'<meta[^>]*content=["\']([^"\']*)["\'][^>]*name=["\']description["\']', html, re.IGNORECASE)
    data['meta_desc'] = clean(m.group(1)) if m else ''

    # H1
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL | re.IGNORECASE)
    data['h1'] = clean(h1s[0]) if h1s else ''
    data['h1_count'] = len(h1s)

    # All H2s
    h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', html, re.DOTALL | re.IGNORECASE)
    data['h2s'] = [clean(h) for h in h2s if clean(h)]

    # All H3s
    h3s = re.findall(r'<h3[^>]*>(.*?)</h3>', html, re.DOTALL | re.IGNORECASE)
    data['h3s'] = [clean(h) for h in h3s if clean(h)]

    # Body text - extract all paragraph text
    # Remove script, style, nav, footer, header blocks first
    body = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r'<style[^>]*>.*?</style>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r'<nav[^>]*>.*?</nav>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r'<footer[^>]*>.*?</footer>', ' ', body, flags=re.DOTALL | re.IGNORECASE)
    body = re.sub(r'<header[^>]*>.*?</header>', ' ', body, flags=re.DOTALL | re.IGNORECASE)

    # Extract paragraph content
    paras = re.findall(r'<p[^>]*>(.*?)</p>', body, re.DOTALL | re.IGNORECASE)
    data['paragraphs'] = [clean(p) for p in paras if len(clean(p)) > 30]

    # Extract list items
    lis = re.findall(r'<li[^>]*>(.*?)</li>', body, re.DOTALL | re.IGNORECASE)
    data['list_items'] = [clean(l) for l in lis if len(clean(l)) > 10]

    # Word count of visible text
    all_text = clean(re.sub(r'<[^>]+>', ' ', body))
    data['word_count'] = len(all_text.split())

    # FAQ questions (best-effort)
    faq_qs = re.findall(r'<[^>]*class=["\'][^"\']*faq[^"\']*["\'][^>]*>(.*?)</[^>]+>', body, re.DOTALL | re.IGNORECASE)
    data['faqs'] = [clean(q) for q in faq_qs if clean(q)]

    return data


def fetch_page(url, retries=3):
    """Fetch a page with retries"""
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    for i in range(retries):
        try:
            r = requests.get(url, headers=headers, timeout=30, allow_redirects=True)
            if r.status_code == 200:
                return r.text
            elif r.status_code == 404:
                return None
            time.sleep(2)
        except Exception as e:
            if i == retries - 1:
                return None
            time.sleep(3)
    return None


def compare_fields(wp_data, new_data, url_pair):
    """Compare all fields and return list of issues"""
    issues = []

    # Title - strict match
    if wp_data['title'] != new_data['title']:
        issues.append({
            'field': 'TITLE',
            'severity': 'HIGH',
            'wordpress': wp_data['title'],
            'new_site': new_data['title'],
            'match': False
        })

    # Meta description - strict match
    if wp_data['meta_desc'] != new_data['meta_desc']:
        issues.append({
            'field': 'META_DESC',
            'severity': 'HIGH',
            'wordpress': wp_data['meta_desc'],
            'new_site': new_data['meta_desc'],
            'match': False
        })

    # H1 - strict match
    if wp_data['h1'] != new_data['h1']:
        issues.append({
            'field': 'H1',
            'severity': 'HIGH',
            'wordpress': wp_data['h1'],
            'new_site': new_data['h1'],
            'match': False
        })

    # H2s - check all WP h2s exist in new site
    wp_h2_set = set(wp_data['h2s'])
    new_h2_set = set(new_data['h2s'])
    missing_h2s = wp_h2_set - new_h2_set
    if missing_h2s:
        issues.append({
            'field': 'H2_MISSING',
            'severity': 'MEDIUM',
            'wordpress': list(missing_h2s),
            'new_site': 'MISSING',
            'match': False
        })

    # Word count comparison - flag if new site has less than 70% of WP word count
    wp_wc = wp_data['word_count']
    new_wc = new_data['word_count']
    if wp_wc > 0 and new_wc < (wp_wc * 0.7):
        issues.append({
            'field': 'WORD_COUNT',
            'severity': 'MEDIUM',
            'wordpress': str(wp_wc) + ' words',
            'new_site': str(new_wc) + ' words (' + str(round(new_wc/wp_wc*100)) + '% of WP)',
            'match': False
        })

    # Check key paragraphs - look for important content from WP in new site
    if wp_data['paragraphs']:
        new_all_text = ' '.join(new_data['paragraphs'] + new_data['list_items']).lower()
        for i, para in enumerate(wp_data['paragraphs'][:5]):
            key_phrase = para[:60].lower().strip()
            if len(key_phrase) > 20 and key_phrase not in new_all_text:
                issues.append({
                    'field': f'PARAGRAPH_{i+1}_MISSING',
                    'severity': 'HIGH',
                    'wordpress': para[:150] + '...',
                    'new_site': 'NOT FOUND IN PAGE',
                    'match': False
                })

    return issues


def _extract_sitemap_urls(content):
    raw = re.findall(r'<loc>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</loc>', content)
    return [u.strip() for u in raw if u.strip()]


def get_country_urls(cc, wp_base):
    """Get all URLs to check for a country from its sitemap"""
    urls = []

    sitemap_index = fetch_page(f'{wp_base}sitemap_index.xml')
    if not sitemap_index:
        return []

    sub_sitemaps = _extract_sitemap_urls(sitemap_index)

    for sm_url in sub_sitemaps:
        if any(x in sm_url for x in ['faq_category', 'tag', 'author', 'category']):
            continue

        sm_content = fetch_page(sm_url)
        if not sm_content:
            continue

        page_urls = _extract_sitemap_urls(sm_content)

        for url in page_urls:
            if any(x in url for x in ['privacy', 'terms', 'services-old', 'services-arch', '/home/']):
                continue
            urls.append(url)

    return urls


def wp_url_to_new_url(wp_url, cc):
    """Convert WordPress URL to new Vercel URL"""
    base_new = 'https://carelabz-website-experiment1-ivory.vercel.app'
    path = wp_url.replace('https://carelabz.com', '')
    return base_new + path


def main():
    import argparse
    import os

    parser = argparse.ArgumentParser()
    parser.add_argument('--cc', required=True)
    parser.add_argument('--wp-url', required=True)
    parser.add_argument('--max-pages', type=int, default=0, help='Cap URL count (0 = no cap)')
    args = parser.parse_args()

    cc = args.cc.lower()
    wp_base = args.wp_url

    print(f'\n{"="*60}')
    print(f'CONTENT PARITY CHECK: {cc.upper()} ({wp_base})')
    print(f'{"="*60}\n')

    urls = get_country_urls(cc, wp_base)
    if args.max_pages > 0:
        urls = urls[:args.max_pages]
    print(f'Found {len(urls)} URLs to check\n')

    results = []
    pass_count = 0
    fail_count = 0
    skip_count = 0

    for wp_url in urls:
        new_url = wp_url_to_new_url(wp_url, cc)
        short = wp_url.replace('https://carelabz.com', '')
        print(f'Checking: {short}')

        wp_html = fetch_page(wp_url)
        new_html = fetch_page(new_url)

        if not wp_html:
            print(f'  SKIP - WP page returned 404/error')
            skip_count += 1
            continue

        if not new_html:
            print(f'  FAIL - New site page returned 404/error')
            fail_count += 1
            results.append({
                'wp_url': wp_url,
                'new_url': new_url,
                'status': 'PAGE_MISSING',
                'issues': [{'field': 'PAGE', 'severity': 'CRITICAL', 'wordpress': 'EXISTS', 'new_site': '404', 'match': False}]
            })
            continue

        wp_data = extract_meta(wp_html, wp_url)
        new_data = extract_meta(new_html, new_url)
        issues = compare_fields(wp_data, new_data, (wp_url, new_url))

        if issues:
            fail_count += 1
            print(f'  FAIL - {len(issues)} issues found')
            for issue in issues:
                wp_v = str(issue['wordpress'])[:80]
                new_v = str(issue['new_site'])[:80]
                print(f'    [{issue["severity"]}] {issue["field"]}: WP="{wp_v}" NEW="{new_v}"')
        else:
            pass_count += 1
            print(f'  PASS')

        results.append({
            'wp_url': wp_url,
            'new_url': new_url,
            'status': 'FAIL' if issues else 'PASS',
            'wp_word_count': wp_data['word_count'],
            'new_word_count': new_data['word_count'],
            'issues': issues
        })

        time.sleep(0.5)

    os.makedirs('data/parity-reports', exist_ok=True)
    output_file = f'data/parity-reports/{cc}-parity-report.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            'country': cc.upper(),
            'wp_base': wp_base,
            'total_pages': len(urls),
            'pass': pass_count,
            'fail': fail_count,
            'skip': skip_count,
            'pass_rate': round(pass_count / max(pass_count + fail_count, 1) * 100, 1),
            'results': results
        }, f, indent=2, ensure_ascii=False)

    print(f'\n{"="*60}')
    print(f'SUMMARY: {cc.upper()}')
    print(f'  Total pages checked: {len(urls)}')
    print(f'  PASS: {pass_count}')
    print(f'  FAIL: {fail_count}')
    print(f'  SKIP: {skip_count}')
    print(f'  Pass rate: {round(pass_count / max(pass_count + fail_count, 1) * 100, 1)}%')
    print(f'  Report saved: {output_file}')
    print(f'{"="*60}\n')


if __name__ == '__main__':
    main()
