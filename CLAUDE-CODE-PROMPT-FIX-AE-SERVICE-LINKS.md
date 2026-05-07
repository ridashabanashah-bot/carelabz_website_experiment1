# Claude Code Prompt — Fix UAE Homepage Service Links (404s)

Copy everything below the line into Claude Code.

---

## Task: Fix the broken service links on the UAE homepage

Read `CLAUDE.md` before starting.

**Problem:** Clicking any service on the AE homepage gives a 404. The Strapi HomePage entry for `region=ae` has service hrefs pointing to non-existent category URLs like `/ae/testing/`, `/ae/calibration/`, `/ae/inspection/`. These were scraped from the WordPress homepage which used category pages. The new site uses `/ae/services/[slug]/` for individual service pages.

**Root cause:** The Strapi `home-pages` entry (documentId: `kmqlh4ngf6hli6akrdiaoe50`) has this services array:

```json
[
  {"href": "/ae/testing/", "title": "Testing"},
  {"href": "/ae/calibration/", "title": "Calibration"},
  {"href": "/ae/inspection/", "title": "Inspection"},
  {"href": "/ae/study-and-analysis/", "title": "Study and Analysis"},
  {"href": "/ae/thermography/", "title": "Thermography"}
]
```

None of those routes exist. The actual service pages in Strapi have slugs like `arc-flash-study-analysis-ae`, `circuit-breaker-testing-ae`, etc.

---

## Fix: Update the Strapi HomePage services array via API

```bash
source .env.local

curl -X PUT \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  -H "Content-Type: application/json" \
  "https://rational-cheese-8e8c4f80ea.strapiapp.com/api/home-pages/kmqlh4ngf6hli6akrdiaoe50" \
  -d '{
    "data": {
      "services": [
        {
          "href": "/ae/services/arc-flash-study-analysis-ae/",
          "icon": "Zap",
          "title": "Arc Flash Study & Analysis",
          "description": "IEEE 1584 arc flash hazard analysis and DEWA-compliant safety assessments."
        },
        {
          "href": "/ae/services/short-circuit-study-analysis-ae/",
          "icon": "BarChart",
          "title": "Short Circuit Analysis",
          "description": "Fault current calculations and protective device coordination."
        },
        {
          "href": "/ae/services/load-flow-analysis-ae/",
          "icon": "Settings",
          "title": "Load Flow Analysis",
          "description": "Power flow optimization and voltage regulation studies."
        },
        {
          "href": "/ae/services/relay-coordination-study-and-analysis-ae/",
          "icon": "Shield",
          "title": "Relay Coordination Study",
          "description": "Protection coordination and selectivity analysis."
        },
        {
          "href": "/ae/services/electrical-thermography-inspection-ae/",
          "icon": "Thermometer",
          "title": "Thermographic Inspection",
          "description": "Infrared scanning of electrical systems and switchgear."
        },
        {
          "href": "/ae/services/circuit-breaker-testing-ae/",
          "icon": "CheckCircle",
          "title": "Circuit Breaker Testing",
          "description": "Performance verification and safety compliance testing."
        }
      ]
    }
  }'
```

**Before running**, verify those slugs actually exist in Strapi:

```bash
source .env.local
BASE="https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
AUTH="Authorization: Bearer $STRAPI_API_TOKEN"

# Check each slug exists
for SLUG in arc-flash-study-analysis-ae short-circuit-study-analysis-ae load-flow-analysis-ae relay-coordination-study-and-analysis-ae electrical-thermography-inspection-ae circuit-breaker-testing-ae; do
  COUNT=$(curl -s -H "$AUTH" "$BASE/service-pages?filters[slug][\$eq]=$SLUG&filters[region][\$eq]=ae" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])")
  echo "$SLUG → $COUNT entries"
done
```

If any slug returns 0, find the correct slug:

```bash
# List all AE service slugs
curl -s -H "$AUTH" "$BASE/service-pages?filters[region][\$eq]=ae&pagination[pageSize]=100&fields[0]=slug&fields[1]=title" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in sorted(data, key=lambda x: x['slug']):
    print(f'{d[\"slug\"]:50s} {d[\"title\"][:60]}')"
```

Then update the `href` values in the PUT request to match the actual slugs.

---

## Also fix: CTA hrefs that point to old WP paths

The same Strapi homepage entry has:
- `heroPrimaryCtaHref`: `/ae/contact-us/` → should be `/ae/contact/`
- `heroSecondaryCtaHref`: `/ae/our-services/` → should be `/ae/services/`
- `ctaBannerPrimaryHref`: `/ae/contact-us/` → should be `/ae/contact/`

Fix these in the same PUT request — add to the `data` object:

```json
{
  "data": {
    "heroPrimaryCtaHref": "/ae/contact/",
    "heroSecondaryCtaHref": "/ae/services/",
    "ctaBannerPrimaryHref": "/ae/contact/",
    "services": [... the array above ...]
  }
}
```

---

## Verification

1. After the PUT, fetch the homepage again and confirm the services array has correct `/ae/services/` hrefs:
   ```bash
   curl -s -H "$AUTH" "$BASE/home-pages?filters[region][\$eq]=ae&populate=services" | python3 -c "
   import sys,json
   d=json.load(sys.stdin)['data'][0]
   for s in d['services']:
       print(f'{s[\"title\"]:40s} → {s[\"href\"]}')"
   ```

2. Visit `https://carelabz-website-experiment1-ivory.vercel.app/ae/` in the browser. Click each service — they should all load the service detail page instead of 404.

3. Click "Get a Quote" in hero — should go to `/ae/contact/`, not 404.

4. Click "Our Services" in hero — should go to `/ae/services/`, not 404.

**No code changes needed — this is a Strapi data fix only.**
