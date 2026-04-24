"""Snapshot: list all BR blog posts in Strapi with key fields."""
import json
import urllib.request

STRAPI = "https://rational-cheese-8e8c4f80ea.strapiapp.com"

TOKEN = ""
with open(".env.local", encoding="utf-8") as f:
    for line in f:
        if line.startswith("STRAPI_API_TOKEN="):
            TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

assert TOKEN, "STRAPI_API_TOKEN not found"

qs = (
    "filters[region][$eq]=br"
    "&fields[0]=title&fields[1]=slug&fields[2]=documentId&fields[3]=excerpt"
    "&fields[4]=metaTitle&fields[5]=metaDescription"
    "&pagination[pageSize]=100"
)
req = urllib.request.Request(
    f"{STRAPI}/api/blog-posts?{qs}",
    headers={"Authorization": f"Bearer {TOKEN}"},
)
with urllib.request.urlopen(req, timeout=30) as r:
    data = json.loads(r.read().decode())

entries = data.get("data", [])
print(f"Found {len(entries)} BR blog posts.\n")
for e in entries:
    print(f"documentId: {e.get('documentId')}")
    print(f"  slug:      {e.get('slug')}")
    print(f"  title:     {e.get('title')!r}")
    print(f"  metaTitle: {e.get('metaTitle')!r}")
    excerpt = (e.get("excerpt") or "")[:100]
    print(f"  excerpt:   {excerpt!r}")
    print()
