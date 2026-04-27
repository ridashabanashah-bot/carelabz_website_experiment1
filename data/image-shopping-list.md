# AE Image Shopping List

Unsplash Source API is deprecated (returns 503) and direct photo download URLs require valid IDs. To add fresh stock imagery, download these manually from https://unsplash.com (free for commercial use, no attribution required) and save to `public/images/ae/` at 1200px width, JPEG quality 80, ≤150KB each.

## Heroes / Service detail right column

| Filename | Search terms | Use |
|---|---|---|
| `hero-switchgear.jpg` | "electrical switchgear" "high voltage panel" | Short-circuit, relay, transformer, protection services |
| `hero-control-panel.jpg` | "industrial control panel" "SCADA control room" | Load flow, calibration, motor, power-quality services |
| `service-thermal-imaging.jpg` | "thermal imaging electrical" "infrared camera" | Thermograph service |
| `service-electrical-testing.jpg` | "electrical testing equipment" "engineer multimeter" | Circuit-breaker, cable, ground services |

## Page-specific

| Filename | Search terms | Use |
|---|---|---|
| `dubai-skyline.jpg` | "Dubai skyline business district" "Dubai marina" | Contact page hero |
| `engineering-team-uae.jpg` | "engineering team UAE" "professional engineers Dubai" | About page hero |
| `power-grid-aerial.jpg` | "power grid aerial" "transmission lines" | Generic blog thumbnail |

## Already in repo (re-used heavily)

These 14 already exist under `public/images/` and `public/images/industries|insights/` — Step 3 uploads them as-is. No download needed:
- `hero-arc-flash.jpg`, `arc-flash-report.jpg`, `safety-assessment.jpg`
- `industries/{commercial-real-estate,data-centers,education,government,healthcare,manufacturing,oil-and-gas,utilities}.jpg`
- `insights/{dewa-requirements-for-arc-f,reducing-incident-energy-in,understanding-ieee-1584-2018}.jpg`

## Optimization

After downloading, run:
```bash
python3 -c "
from PIL import Image
import os, glob
for f in glob.glob('public/images/ae/*.jpg'):
    img = Image.open(f)
    if img.width > 1200:
        ratio = 1200 / img.width
        img = img.resize((1200, int(img.height * ratio)), Image.LANCZOS)
    img.save(f, 'JPEG', quality=80, optimize=True)
    print(f'{os.path.basename(f)}: {os.path.getsize(f)/1024:.0f}KB')
"
```

Then re-run `python3 scripts/ae-upload-images.py` and `python3 scripts/ae-link-images.py` to upload + relink.
