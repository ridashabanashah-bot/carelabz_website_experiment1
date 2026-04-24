"""Populate the 5 BR ServicePage entries in Strapi with real content.

Source: data/br-content-audit.md (extracted from www.carelabz.com/br/).
Each page gets full features, process, safety, reports, FAQs, CTAs,
trust badges, SEO meta, and a clean markdown body — rewritten for clarity
and AEO structure per CLAUDE.md brand voice.
"""
from __future__ import annotations

import json
import urllib.request
import urllib.error

STRAPI = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
TOKEN = ""
with open(".env.local", encoding="utf-8") as f:
    for line in f:
        if line.startswith("STRAPI_API_TOKEN="):
            TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
            break
assert TOKEN, "STRAPI_API_TOKEN missing"


def http(method, path, body=None):
    req_body = json.dumps({"data": body}).encode() if body else None
    headers = {"Authorization": f"Bearer {TOKEN}"}
    if req_body:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(
        STRAPI + path, data=req_body, headers=headers, method=method
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read().decode()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return {"__error": f"HTTP {e.code}: {e.read().decode('utf-8','replace')[:300]}"}


BR_TRUST_BADGES = [
    {"label": "NR-10"},
    {"label": "ABNT NBR 5410"},
    {"label": "IEEE 1584"},
    {"label": "ISO 9001:2008"},
]

CITIES_LINE = (
    "São Paulo, Rio de Janeiro, Brasília, and Salvador — plus every other "
    "major Brazilian industrial region."
)

COMMON_CTA = {
    "ctaBannerPrimaryText": "Request a Free Quote",
    "ctaBannerPrimaryHref": "/br/contact-us/",
    "ctaBannerSecondaryText": "Explore All Services",
    "ctaBannerSecondaryHref": "/br/services/",
    "faqSectionHeading": "Frequently Asked Questions",
}


# ─── Service content ───────────────────────────────────────────────────────

SERVICES = {
    "o1o7pj6yfjugkmx7lp7nf78s": {  # arc-flash-study-br
        "title": "Arc Flash Study",
        "slug": "arc-flash-study-br",
        "metaTitle": "Arc Flash Study Services in Brazil | Carelabs",
        "metaDescription": "IEEE 1584 arc flash studies, incident-energy calculations, and NR-10-aligned PPE labelling for Brazilian facilities. Delivered by ISO 9001:2008-accredited engineers.",
        "eyebrow": "Electrical Safety",
        "definitionalLede": "An arc flash study quantifies the incident energy at every piece of electrical equipment, sets safe approach boundaries, and specifies the PPE category workers must wear. Carelabs delivers IEEE 1584-aligned studies with NR-10 mitigation recommendations and ready-to-apply equipment labels.",
        "seoKeywords": [
            "arc flash study Brazil",
            "IEEE 1584 arc flash",
            "NR-10 compliance",
            "incident energy analysis",
            "PPE category labels",
            "arc flash hazard assessment",
        ],
        "trustBadges": BR_TRUST_BADGES,
        "featuresHeading": "Key Challenges We Solve",
        "featuresSubtext": "Our engineers identify and resolve arc flash risks before they become costly incidents — with ETAP-based modelling, short-circuit analysis, and protection coordination rolled into every engagement.",
        "features": [
            {
                "title": "Incident Energy Calculation",
                "description": "IEEE 1584 calculations at every relevant bus, with clearing-time sensitivity so you see exactly where faster protection would cut exposure.",
            },
            {
                "title": "Equipment Labels Ready to Apply",
                "description": "Printed NR-10 / IEEE 1584 labels per panel with incident energy, arc-flash boundary, and required PPE category.",
            },
            {
                "title": "Short Circuit & Coordination",
                "description": "Full three-phase, L-G, L-L, and L-L-G fault analysis with protective-device coordination curves — the foundation every arc flash study is built on.",
            },
            {
                "title": "Prioritised Mitigation Plan",
                "description": "Ranked recommendations — from setting changes to arc-resistant switchgear upgrades — with cost and incident-energy impact for each option.",
            },
        ],
        "safetyEyebrow": "Worker Safety",
        "safetyHeading": "Protect Your Team from the Most Dangerous Electrical Hazard",
        # Strapi Text field has a ~255-char limit — keep safetyBody short
        "safetyBody": "Arc flash temperatures exceed 19,000 °C — enough to vaporise copper and cause severe burns at distance. Every Brazilian facility with switchgear, MCCs, or panelboards has exposure.",
        "safetyBullets": [
            "Eliminate energised work wherever possible; document exceptions",
            "Install remote racking and arc-flash detection where exposure is high",
            "Train every qualified worker annually and audit the training",
            "Match PPE category to the calculated incident energy at each task",
            "Keep labels current — re-study after any system change",
        ],
        "reportsEyebrow": "Deliverables",
        "reportsHeading": "Comprehensive Report Package",
        "reportsBody": "Every arc flash engagement ends with a digital report package aligned with IEEE 1584 and NR-10. Your team gets everything they need for compliance audits and daily operations.",
        "reportsBullets": [
            "Updated single-line diagrams and equipment inventory",
            "Short-circuit, coordination, and incident-energy results bus-by-bus",
            "Printed NR-10 / IEEE 1584 labels for every panel and piece of switchgear",
            "Ranked mitigation plan with estimated cost and incident-energy reduction",
            "Executive summary plus a full technical appendix for engineering review",
        ],
        "processHeading": "Our Process",
        "processSteps": [
            {
                "number": 1,
                "title": "Data Collection",
                "description": "On-site walkdown to capture single-line diagrams, nameplate data, cable lengths, and existing protection settings.",
            },
            {
                "number": 2,
                "title": "ETAP Modelling",
                "description": "Build the power system model in ETAP, run short-circuit analysis, and coordinate protection devices.",
            },
            {
                "number": 3,
                "title": "Arc Flash Calculation",
                "description": "IEEE 1584 incident-energy calculations, arc-flash boundary determination, and PPE category selection.",
            },
            {
                "number": 4,
                "title": "Labels & Report",
                "description": "Print equipment labels, document findings, rank mitigation options, and deliver the final report package.",
            },
        ],
        "faqs": [
            {
                "question": "What is an arc flash study?",
                "answer": "An arc flash study calculates the incident energy available at every piece of energised electrical equipment in your facility. The results define safe approach boundaries and the PPE category workers must wear, as required by NR-10 and IEEE 1584.",
            },
            {
                "question": "How often should an arc flash study be updated?",
                "answer": "Every five years at minimum, and immediately after any change that affects fault current — new transformer, new generation source, significant load addition, or upstream utility upgrade. Out-of-date studies are a common NR-10 audit finding.",
            },
            {
                "question": "Which standard does Carelabs follow for arc flash analysis in Brazil?",
                "answer": "IEEE 1584 for the calculation method and NR-10 / ABNT NBR 5410 for the Brazilian regulatory framework. Our reports are accepted by MTE auditors and major utility clients.",
            },
            {
                "question": "Can arc flash risk be eliminated?",
                "answer": "Not eliminated, but reduced dramatically. Faster protection clearing times, arc-resistant switchgear, remote racking, and bus segmentation can cut incident energy by an order of magnitude on typical Brazilian industrial systems.",
            },
            {
                "question": "How long does a typical arc flash study take?",
                "answer": "For a mid-size industrial plant, expect 3–6 weeks from site visit to final report — faster if drawings are current and protection-relay settings are documented.",
            },
        ],
        "ctaBannerHeading": "Ready to Schedule Your Arc Flash Study?",
        "ctaBannerBody": f"Our ISO 9001:2008-accredited engineers deliver IEEE 1584 studies across {CITIES_LINE} Fast turnaround, clear reports, full NR-10 compliance support.",
        **COMMON_CTA,
        "body": """## What an arc flash study actually does

An arc flash is the light and heat released when current jumps between conductors through an air gap. The discharge ionises the air, sustains the arc, and reaches temperatures above 19,000 °C at the arc itself. The result: severe burns, blast injury, and equipment destruction.

An **arc flash study** is the engineering analysis that quantifies how dangerous that event would be at each piece of your switchgear, motor control, panelboard, and transformer — and then tells you how to reduce it.

## What you get

- **Incident energy** at every energised bus, calculated per IEEE 1584
- **Arc-flash boundary** distances you must respect during energised work
- **PPE category** matched to each task's calculated energy
- **Labels** printed and ready to apply to every piece of equipment
- **Mitigation recommendations** ranked by cost and incident-energy reduction
- A **single-line diagram** refreshed to current site conditions

## Why it matters in Brazil

**NR-10** (the Brazilian Ministry of Labour regulation on electrical work) makes risk analysis mandatory for anyone who operates, maintains, or works near energised equipment. **ABNT NBR 5410** is the installation standard. Carelabs delivers arc flash studies aligned with both, plus IEEE 1584 for the calculation method that MTE auditors accept.

## Our engagement model

One fixed-price engagement covers data collection, ETAP modelling, short-circuit analysis, protection coordination, incident-energy calculation, labels, and a final report. No hidden extras.

Talk to our engineers about your next arc flash study — Carelabs serves São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region.
""",
    },
    "ont2dj7coqqqzcv2ihy732af": {  # harmonic-study-and-analysis-br
        "title": "Harmonic Study & Analysis",
        "slug": "harmonic-study-and-analysis-br",
        "metaTitle": "Harmonic Study & Analysis in Brazil | Carelabs",
        "metaDescription": "Identify harmonic distortion, locate resonance risks, and size mitigation with ETAP-based harmonic studies. ABNT-aligned reports for Brazilian facilities.",
        "eyebrow": "Power Quality",
        "definitionalLede": "Harmonic distortion shortens equipment life, raises energy bills, and increases the risk of nuisance tripping. A Carelabs harmonic study measures distortion at the point of common coupling, models your system in ETAP, and sizes the mitigation that brings you back within limits.",
        "seoKeywords": [
            "harmonic study Brazil",
            "harmonic analysis",
            "IEEE 519",
            "total harmonic distortion THD",
            "power quality filter",
            "point of common coupling",
        ],
        "trustBadges": BR_TRUST_BADGES,
        "featuresHeading": "What a Harmonic Study Reveals",
        "featuresSubtext": "Harmonics from variable-speed drives, UPS systems, and LED lighting disrupt more than just power quality — they drive transformer overheating, capacitor failures, and relay misoperation.",
        "features": [
            {
                "title": "Point of Common Coupling Measurement",
                "description": "Measure voltage and current THD at the PCC using calibrated analysers and benchmark against IEEE 519 and ABNT guidance.",
            },
            {
                "title": "Resonance Risk Detection",
                "description": "Identify parallel and series resonance points where capacitor banks amplify specific harmonic orders and cause equipment damage.",
            },
            {
                "title": "Load-by-Load Spectrum",
                "description": "Characterise every nonlinear load — VFDs, rectifiers, UPS — so mitigation is sized correctly for your actual load mix.",
            },
            {
                "title": "Mitigation Sizing",
                "description": "Passive filter, active filter, or drive-side reactor: we model each option in ETAP and show you which one hits your distortion target for the lowest capex.",
            },
        ],
        "safetyEyebrow": "Equipment Protection",
        "safetyHeading": "Catch Harmonic Damage Before It Shows Up",
        "safetyBody": "Harmonic distortion accelerates insulation ageing, overheats transformers, and trips breakers without any obvious upstream fault. The damage is cumulative and often mistaken for normal wear — which is why annual harmonic monitoring pays for itself.",
        "safetyBullets": [
            "Neutral conductors overload on 3rd and 9th harmonics — detect early",
            "Capacitor banks fail prematurely when they resonate with system inductance",
            "Motors run hotter and lose efficiency as THD rises above 8%",
            "Protective relays misoperate when waveforms distort beyond rated limits",
            "Energy bills climb as reactive power and losses compound",
        ],
        "reportsEyebrow": "Deliverables",
        "reportsHeading": "What's in Your Harmonic Report",
        "reportsBody": "Every Carelabs harmonic report includes measured data, ETAP simulation results, and a sized mitigation plan — digital PDF plus raw measurement files for your engineering team.",
        "reportsBullets": [
            "Individual and total harmonic distortion (THD) at every measured bus",
            "Harmonic frequency spectrum plots with dominant orders flagged",
            "Resonance sweep showing parallel/series risk across the audible range",
            "Mitigation design — filter rating, placement, and expected post-install THD",
            "Compliance gap analysis against IEEE 519 and ABNT NBR limits",
        ],
        "processHeading": "Our Process",
        "processSteps": [
            {
                "number": 1,
                "title": "Single-Line Review",
                "description": "Mark every nonlinear load, capacitor bank, and long medium-voltage cable on the drawing.",
            },
            {
                "number": 2,
                "title": "On-site Measurement",
                "description": "Connect power-quality analysers at the PCC and sensitive buses for a 7–14 day recording window.",
            },
            {
                "number": 3,
                "title": "ETAP Modelling",
                "description": "Build the harmonic model, run frequency-domain analysis, and calculate THD per bus.",
            },
            {
                "number": 4,
                "title": "Mitigation Design",
                "description": "Size the filter or reactor, re-run the model with mitigation in place, and verify compliance.",
            },
        ],
        "faqs": [
            {
                "question": "When does a facility need a harmonic study?",
                "answer": "When nonlinear load exceeds 15% of total bus load, when you're adding VFDs or UPS capacity, when a new capacitor bank is planned, or when equipment is failing without an obvious cause. Resonance with a new capacitor bank is a frequent trigger.",
            },
            {
                "question": "What are the harmonic limits in Brazil?",
                "answer": "ABNT guidance aligns with IEEE 519 for voltage THD at the PCC — typically 5% for systems below 1 kV and 3% for medium-voltage. Current THD limits depend on the short-circuit ratio at your connection point.",
            },
            {
                "question": "Passive filter or active filter — which is right for my site?",
                "answer": "Passive filters are cheaper and handle a single dominant harmonic order well. Active filters handle wider spectra and changing load conditions, and also provide reactive compensation. Our study tells you which matches your actual load profile.",
            },
            {
                "question": "How long does a harmonic study take?",
                "answer": "Two to four weeks end-to-end: measurement window is the bottleneck, usually 7–14 days of continuous recording to capture all shift patterns and load conditions.",
            },
            {
                "question": "Will a harmonic study shut down my plant?",
                "answer": "No. Measurements are taken non-intrusively at existing metering points. The only disruption is when we install temporary analysers, which takes minutes per location.",
            },
        ],
        "ctaBannerHeading": "Bring Your Facility Back Within Harmonic Limits",
        "ctaBannerBody": f"Carelabs engineers deliver ETAP-based harmonic studies across {CITIES_LINE} Digital reports, ranked mitigation, IEEE 519 + ABNT compliance.",
        **COMMON_CTA,
        "body": """## Why harmonic distortion hurts

An ideal supply delivers a clean sinusoidal voltage. In real facilities, nonlinear loads — variable-speed drives, switched-mode power supplies, LED lighting, UPS systems, electronic ballasts — pull current in short bursts that distort the waveform. That distortion is measured as **total harmonic distortion (THD)**.

Persistent harmonic distortion above IEEE 519 limits causes:

- Additional Joule-effect losses inside conductors, transformers, and motors
- Neutral-conductor overload on 3rd and 9th harmonics
- Capacitor bank failure when they resonate with system inductance
- Relay misoperation and nuisance breaker trips
- Reduced equipment lifespan once THD reaches ~10%

## When to run a harmonic study

- Nonlinear load exceeds 15% of total bus load
- You're planning a VFD, UPS, or rectifier installation
- A new capacitor bank is being added or resized
- Unexplained transformer heating, relay trips, or motor failures
- Commissioning a new facility connected to an LV distribution board

## What gets delivered

Every Carelabs harmonic study ships with measured THD per bus, ETAP frequency-domain analysis, resonance sweep, and a sized mitigation plan — passive filter, active filter, or drive-side reactor depending on your load profile. All aligned with **IEEE 519** and **ABNT** guidance.

Request a quote for your next harmonic assessment — Carelabs serves São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region.
""",
    },
    "ppijey1ntwa01c67i29g6urn": {  # motor-start-analysis-br
        "title": "Motor Start Analysis",
        "slug": "motor-start-analysis-br",
        "metaTitle": "Motor Start Analysis in Brazil | Carelabs",
        "metaDescription": "Predict voltage dip, torque profile, and breaker response before starting a large motor. ETAP-based motor starting studies for Brazilian industrial facilities.",
        "eyebrow": "Power System Engineering",
        "definitionalLede": "Starting a large motor on a weak bus can drop terminal voltage below 80% of nameplate, stall connected loads, and trip upstream breakers. A Carelabs motor start analysis models the event in ETAP and tells you — before you hit the button — what will happen.",
        "seoKeywords": [
            "motor start analysis Brazil",
            "motor starting study",
            "voltage dip",
            "ETAP transient analysis",
            "induction motor torque",
            "soft starter sizing",
        ],
        "trustBadges": BR_TRUST_BADGES,
        "featuresHeading": "Questions a Motor Start Study Answers",
        "featuresSubtext": "Motor starting is the single most disruptive event a facility's electrical system sees. Knowing the outcome in advance saves you from nuisance trips, stalled loads, and embarrassing commissioning delays.",
        "features": [
            {
                "title": "Can the Supply Start the Motor?",
                "description": "Calculate voltage dip at the motor terminals and every sensitive bus — check that terminal voltage stays above 80% of rated as the motor accelerates.",
            },
            {
                "title": "Will the Motor Reach Full Speed?",
                "description": "Compare motor torque-speed curve against load torque-speed curve. If they cross before synchronous speed, the motor will stall.",
            },
            {
                "title": "What Breaker Will Trip?",
                "description": "Check protective-device coordination through the starting transient — inrush peaks should ride through without tripping upstream.",
            },
            {
                "title": "Do You Need a Soft Starter?",
                "description": "If direct-on-line starting violates limits, we size the soft starter, VFD, or autotransformer that restores compliance.",
            },
        ],
        "safetyEyebrow": "Equipment Protection",
        "safetyHeading": "Protect Downstream Loads From Motor-Start Transients",
        "safetyBody": "Voltage drops during motor starts affect everything on the bus — lighting, PLCs, drives, instrumentation. Modelling the transient protects the whole plant.",
        "safetyBullets": [
            "Terminal voltage must stay at or above 80% of rated during acceleration",
            "Starting current typically 5–7× full-load amps for direct-on-line starts",
            "Supply transformer trips if motor exceeds 30% of base kVA on DOL start",
            "Generator-only supplies need the motor to stay below 10–15% of kVA rating",
            "Sensitive electronics on the same bus need voltage-ride-through verified",
        ],
        "reportsEyebrow": "Deliverables",
        "reportsHeading": "Motor Start Report Contents",
        "reportsBody": "Every motor start report includes time-domain simulations, starting-current curves, voltage-recovery plots, and a clear go/no-go recommendation for direct-on-line start — or a sized starter if needed.",
        "reportsBullets": [
            "Voltage vs time at motor terminals and every sensitive bus",
            "Current vs time from inrush through steady-state",
            "Motor and load torque-speed curves with acceleration margin",
            "Starter sizing and settings when DOL is not viable",
            "Recommendations for bus configuration during start (open-tie vs closed)",
        ],
        "processHeading": "Our Process",
        "processSteps": [
            {
                "number": 1,
                "title": "Data Collection",
                "description": "Motor nameplate, starting impedance, load inertia, and supply short-circuit data — the four things a starting study lives or dies on.",
            },
            {
                "number": 2,
                "title": "Baseline Simulation",
                "description": "Model direct-on-line start in ETAP and evaluate voltage dip, acceleration time, and breaker behaviour.",
            },
            {
                "number": 3,
                "title": "Starter Evaluation",
                "description": "If DOL fails, simulate soft starter, VFD, autotransformer, and reduced-voltage options until you have one that meets limits.",
            },
            {
                "number": 4,
                "title": "Report & Settings",
                "description": "Deliver the report plus recommended protective-relay settings tuned for the start transient.",
            },
        ],
        "faqs": [
            {
                "question": "When is a motor start analysis needed?",
                "answer": "Before commissioning a motor larger than 30% of your supply transformer's kVA rating, before adding a motor on a generator-only supply, or any time multiple motors start simultaneously on an industrial sequence.",
            },
            {
                "question": "What minimum voltage does the motor need during start?",
                "answer": "At least 80% of rated voltage at the terminals throughout acceleration. Lower voltages reduce starting torque — which is proportional to voltage squared — and can cause the motor to stall before reaching rated speed.",
            },
            {
                "question": "Do you need dynamic motor data for the simulation?",
                "answer": "Detailed dynamic models produce the most accurate results, but when manufacturer data is unavailable we use measured starting impedance and standard induction-machine models. Our report notes which method was used.",
            },
            {
                "question": "Will a soft starter solve every motor-start problem?",
                "answer": "Usually — but not always. Soft starters reduce inrush current, not starting energy. For high-inertia loads or weak supplies, a VFD or autotransformer may be the only way to start within limits. Our analysis tells you which fits.",
            },
            {
                "question": "How long does a motor start analysis take?",
                "answer": "One to three weeks depending on how many scenarios you want modelled (DOL, soft starter, VFD, reduced-voltage, etc.) and whether we need to measure starting impedance on existing motors.",
            },
        ],
        "ctaBannerHeading": "Model Your Motor Start Before You Commission",
        "ctaBannerBody": f"Carelabs engineers deliver ETAP-based motor starting studies for industrial facilities across {CITIES_LINE}",
        **COMMON_CTA,
        "body": """## Why motor starting gets its own study

Starting a large induction motor is the most disruptive event a normal facility's electrical system sees. Inrush current peaks at 5–7× full-load amps for several seconds. Terminal voltage dips. Every load sharing the bus feels it — lights flicker, PLCs glitch, undervoltage relays drop out, contactors chatter.

Get it wrong and commissioning stalls. Get it right with a **motor start analysis** and the event is a non-event.

## What we analyse

- **Terminal voltage** — must stay above 80% of rated throughout acceleration
- **Acceleration time** — must be shorter than motor thermal limits
- **Starting torque** — motor torque must exceed load torque at every speed
- **Protective-device response** — upstream breakers must ride through inrush
- **Bus voltage at sensitive loads** — lighting, instrumentation, drives

## Situations that require a motor start study

- Motor > 30% of supply transformer base kVA
- Motor > 10–15% of kVA rating on generator-only supplies
- Multiple motors starting in sequence (industrial batching lines)
- Long-cable installations where voltage drop is already near the limit

## What you get

Time-domain simulation results, voltage and current waveforms, starter sizing (if direct-on-line fails), and recommended relay settings tuned to ride through the transient. All delivered as a digital report.

Carelabs serves São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region. [Talk to an engineer](/br/contact-us/) about your next motor commissioning.
""",
    },
    "uaxinq421fkhk07tmorrvc4e": {  # power-system-study-and-analysis-br
        "title": "Power System Study & Analysis",
        "slug": "power-system-study-and-analysis-br",
        "metaTitle": "Power System Study & Analysis in Brazil | Carelabs",
        "metaDescription": "Load flow, short circuit, protection coordination, and transient studies in a single ETAP-based engagement. ABNT + IEEE-aligned reports for Brazilian facilities.",
        "eyebrow": "Engineering Studies",
        "definitionalLede": "A power system study answers the three questions every industrial facility needs answered: can the network carry the load, survive a fault, and clear it selectively? Carelabs delivers load flow, short circuit, and protection coordination as one integrated engagement.",
        "seoKeywords": [
            "power system study Brazil",
            "load flow analysis",
            "short circuit study",
            "protection coordination",
            "IEC 60909",
            "ETAP simulation",
        ],
        "trustBadges": BR_TRUST_BADGES,
        "featuresHeading": "Four Studies, One Integrated Engagement",
        "featuresSubtext": "Every real-world power system analysis combines multiple studies. Running them separately creates gaps. Running them together — in a single ETAP model — produces results you can actually act on.",
        "features": [
            {
                "title": "Load Flow Analysis",
                "description": "Voltage, current, power factor, and losses at every bus under normal operating conditions. Spot overloaded transformers and voltage violations before they cause outages.",
            },
            {
                "title": "Short Circuit Study",
                "description": "IEC 60909 fault calculations for three-phase, L-G, L-L, and L-L-G faults. Verify that every breaker can interrupt its calculated fault current.",
            },
            {
                "title": "Protection Coordination",
                "description": "Time-current curves for every relay, fuse, and breaker. Confirm the nearest device trips first — and that upstream devices ride through downstream faults.",
            },
            {
                "title": "Transient Analysis",
                "description": "Lightning, switching, and capacitor-energisation transients. Size surge arresters and insulation coordination for your specific system.",
            },
        ],
        "safetyEyebrow": "System Reliability",
        "safetyHeading": "Prove Your Power System Can Survive Its Worst Day",
        "safetyBody": "A power system that works on a normal afternoon may not survive a motor start at shift change or a fault at a remote feeder. Analysis shows you, quantitatively, where the margins are — and where they aren't.",
        "safetyBullets": [
            "Confirm breaker interrupting ratings against calculated fault current",
            "Validate transformer ratings against peak operating load",
            "Check voltage regulation stays within ±5% at every bus",
            "Verify protection coordination is selective across all fault types",
            "Document the baseline — future upgrades get built on solid ground",
        ],
        "reportsEyebrow": "Deliverables",
        "reportsHeading": "Power System Report Contents",
        "reportsBody": "One engagement, one report, everything you need for insurer audits, regulatory filings, and internal engineering review.",
        "reportsBullets": [
            "Updated single-line diagram with every component modelled",
            "Load flow results bus-by-bus under normal and contingency scenarios",
            "Short-circuit fault currents and breaker-duty comparisons",
            "Protection coordination curves with every device plotted",
            "Ranked list of findings with proposed remediation and estimated cost",
        ],
        "processHeading": "Our Process",
        "processSteps": [
            {
                "number": 1,
                "title": "Data Collection",
                "description": "Single-line, nameplate, cable, and relay-setting data. Meeting with operations to confirm typical load profile.",
            },
            {
                "number": 2,
                "title": "System Modelling",
                "description": "Build the full ETAP model with every transformer, cable, breaker, relay, motor, and generator.",
            },
            {
                "number": 3,
                "title": "Run the Studies",
                "description": "Load flow, short circuit, coordination, and transient analyses — all on the same model for consistent results.",
            },
            {
                "number": 4,
                "title": "Report & Review",
                "description": "Deliver the report, walk the operations team through findings, and provide updated relay setting sheets.",
            },
        ],
        "faqs": [
            {
                "question": "How often should a power system study be refreshed?",
                "answer": "Every five years at minimum, and immediately after any material change — new transformer, new generation, large load addition, or upstream utility upgrade. Stale studies are one of the most common compliance audit findings.",
            },
            {
                "question": "What calculation method does Carelabs use for short circuit?",
                "answer": "IEC 60909 for initial symmetrical short-circuit current, peak current, and breaking current. Results are expressed at nominal voltage and include the factor c per table 1 of the standard.",
            },
            {
                "question": "Do I need all four studies or can I pick and choose?",
                "answer": "You can scope to any subset, but they share ~80% of the work (data collection, system modelling). Running all four together typically costs 25–40% less than running them separately, and ensures the results are internally consistent.",
            },
            {
                "question": "Will Carelabs update our relay settings as part of the study?",
                "answer": "Yes. The coordination study produces recommended settings per device, and we deliver setting sheets ready for your relay engineer to load. We can also commission the changes on-site if you prefer.",
            },
            {
                "question": "Does the study cover renewable integration or just conventional loads?",
                "answer": "Both. Solar PV, battery energy storage, and cogeneration are modelled in the same ETAP environment with their specific protection and ride-through requirements.",
            },
        ],
        "ctaBannerHeading": "Get a Baseline Your Operations Team Can Build On",
        "ctaBannerBody": f"Carelabs engineers deliver full power system studies across {CITIES_LINE} Load flow + short circuit + coordination + transients in one engagement.",
        **COMMON_CTA,
        "body": """## What a complete power system analysis covers

Every industrial or commercial facility in Brazil runs on an electrical system that must be safe, dependable, and compliant — under normal operation AND under fault conditions. A **power system study** is the engineering analysis that proves it.

Carelabs delivers four studies as a single engagement:

### Load flow
Voltage, current, power factor, and losses at every bus. Identifies overloads and voltage violations before they cause outages.

### Short circuit
IEC 60909 fault calculations for all standard fault types. Verifies every breaker can interrupt its calculated fault current; flags bracing issues.

### Protection coordination
Time-current curves for every relay, fuse, and breaker. Confirms selectivity — the nearest device trips first.

### Transient analysis
Lightning strikes, switching surges, capacitor energisation. Sizes surge arresters and insulation coordination.

## Why one engagement beats four

Running these studies separately creates gaps. Running them together in a single ETAP model ensures the results are consistent, costs 25–40% less, and produces a single deliverable your operations team can act on.

## What you get

One integrated report with load-flow results, fault currents, coordination curves, transient plots, a ranked findings list, and recommended relay settings. Aligned with IEEE standards and ABNT NBR 5410 for the Brazilian regulatory framework.

Carelabs serves São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region. [Request a quote](/br/contact-us/).
""",
    },
    "yukef52bj1g43p09o9uglzlu": {  # power-quality-analysis-br
        "title": "Power Quality Analysis",
        "slug": "power-quality-analysis-br",
        "metaTitle": "Power Quality Analysis in Brazil | Carelabs",
        "metaDescription": "Measure voltage stability, sags, transients, and harmonics to pinpoint the source of equipment failures. Ranked remediation from Carelabs power quality engineers.",
        "eyebrow": "Power Quality",
        "definitionalLede": "Power quality problems — voltage dips, sags, harmonics, transients — cause most 'unexplained' equipment failures in industrial facilities. A Carelabs power quality analysis measures the supply over two weeks, separates utility-side from facility-side issues, and delivers ranked remediation.",
        "seoKeywords": [
            "power quality analysis Brazil",
            "voltage sag",
            "voltage imbalance",
            "transient analysis",
            "power quality survey",
            "IEEE 519",
        ],
        "trustBadges": BR_TRUST_BADGES,
        "featuresHeading": "Power Quality Issues We Track",
        "featuresSubtext": "Most equipment in a modern facility is more sensitive to supply anomalies than the equipment it replaced. Measuring what's actually on the bus is the first step to fixing what's breaking.",
        "features": [
            {
                "title": "Voltage Stability & Imbalance",
                "description": "Long-duration over-/under-voltage plus three-phase imbalance — both silently kill motors and overheat neutrals.",
            },
            {
                "title": "Sags, Swells, and Interruptions",
                "description": "Fast RMS fluctuations that dropout relays, reset PLCs, and cost production without leaving an obvious fault trace.",
            },
            {
                "title": "Harmonics and Flicker",
                "description": "Waveform distortion from nonlinear loads and fast-changing loads like welders and arc furnaces — measured at the PCC and critical buses.",
            },
            {
                "title": "Transients and Surges",
                "description": "Sub-cycle events from switching, lightning, and capacitor energisation — root cause of many 'mystery' drive and controller failures.",
            },
        ],
        "safetyEyebrow": "Equipment Protection",
        "safetyHeading": "Prevent the Failures You Can't Explain",
        "safetyBody": "Poor power quality degrades equipment silently. Motors age faster on unbalanced voltage. Capacitors fail when they resonate. Drives trip on transients. Measuring the supply is the only way to separate product-quality issues from equipment-quality issues.",
        "safetyBullets": [
            "Sags longer than 0.5 cycles can trip sensitive controls",
            "Imbalance above 2% significantly reduces motor life",
            "Voltage THD above 5% causes measurable equipment heating",
            "Transients above 2 kV damage electronic power supplies",
            "Flicker above 0.8 Pst causes measurable productivity loss",
        ],
        "reportsEyebrow": "Deliverables",
        "reportsHeading": "Power Quality Report Contents",
        "reportsBody": "A complete digital report plus the raw measurement files so your engineering team can reopen the data anytime. Aligned with IEEE 519, IEC 61000-4-30, and ABNT guidance.",
        "reportsBullets": [
            "Event log: every sag, swell, interruption, and transient time-stamped",
            "Voltage and current trends over the measurement window",
            "THD and individual harmonic spectrum at each measurement point",
            "Flicker measurements (Pst, Plt) where relevant",
            "Ranked remediation — source identification, proposed fix, estimated cost",
        ],
        "processHeading": "Our Process",
        "processSteps": [
            {
                "number": 1,
                "title": "Scope and Single-Line Review",
                "description": "Agree on measurement points with operations — usually the PCC plus 2–4 critical distribution boards.",
            },
            {
                "number": 2,
                "title": "Instrumentation",
                "description": "Install class-A power quality analysers at each point. Typical measurement window is 7–14 days to capture every shift and load pattern.",
            },
            {
                "number": 3,
                "title": "Data Analysis",
                "description": "Correlate events with production logs. Separate utility-source issues from internal-source issues — the fix differs for each.",
            },
            {
                "number": 4,
                "title": "Report and Remediation",
                "description": "Deliver findings, rank recommended fixes by ROI, and walk operations through the report.",
            },
        ],
        "faqs": [
            {
                "question": "When should a power quality survey be run?",
                "answer": "After unexplained equipment failures, before qualifying new sensitive equipment, when the utility changes its feed, and as a routine baseline every 3–5 years on critical installations.",
            },
            {
                "question": "How long is the measurement window?",
                "answer": "Seven to fourteen days minimum. That's what it takes to capture all shifts, weekday/weekend differences, and rare events like startup transients or sporadic sags.",
            },
            {
                "question": "Can you identify whether the problem is utility or internal?",
                "answer": "Yes — that's the core of the analysis. By measuring simultaneously at the PCC and at internal buses, we can tell whether disturbances originated upstream or inside the facility. The remediation path is different for each.",
            },
            {
                "question": "What standard do your measurements follow?",
                "answer": "IEC 61000-4-30 class A for measurement methodology, IEEE 519 for harmonic evaluation, and ABNT PRODIST Module 8 for the Brazilian utility-side benchmarks.",
            },
            {
                "question": "Do you also install mitigation equipment?",
                "answer": "We design and specify mitigation — filters, UPS, isolation transformers, arresters — and work with your preferred electrical contractor for installation. We can also commission and verify performance post-install.",
            },
        ],
        "ctaBannerHeading": "Measure It, Then Fix It",
        "ctaBannerBody": f"Carelabs delivers class-A power quality surveys across {CITIES_LINE} IEC 61000-4-30 measurement, IEEE 519 evaluation, ranked remediation.",
        **COMMON_CTA,
        "body": """## Why power quality matters

Most modern equipment — variable-speed drives, PLCs, sensitive instrumentation, LED lighting — is more vulnerable to supply anomalies than the equipment it replaced. Power quality problems that did not matter ten years ago now cause daily nuisance trips, production loss, and premature equipment failure.

A **power quality analysis** measures what is actually on your bus, separates utility-side problems from facility-side problems, and delivers a ranked plan to fix what is breaking.

## What we measure

- **Voltage stability** — long-duration over- and under-voltage
- **Three-phase imbalance** — silent motor killer
- **Sags, swells, and interruptions** — fast RMS events that drop controls
- **Harmonics** — distortion from nonlinear loads
- **Flicker** — modulation from welders, arc furnaces, large intermittent loads
- **Transients** — sub-cycle surges from switching and lightning

## The Carelabs survey

1. Scope the measurement points with operations — PCC plus critical buses
2. Install class-A analysers for 7–14 days
3. Correlate events with production logs
4. Identify the source of each issue (utility vs internal)
5. Deliver a ranked remediation plan with estimated costs

All measurements follow **IEC 61000-4-30** class A methodology. Harmonic evaluation uses **IEEE 519**. Utility benchmarking uses **ABNT PRODIST Module 8**.

Carelabs serves São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region. [Request a power quality survey](/br/contact-us/).
""",
    },
}


def main():
    print(f"Updating {len(SERVICES)} BR service pages ...")
    ok = fail = 0
    for doc_id, payload in SERVICES.items():
        slug = payload.get("slug", "?")
        r = http("PUT", f"/api/service-pages/{doc_id}", payload)
        if "__error" in r:
            print(f"  [ERR] {slug}: {r['__error']}")
            fail += 1
        else:
            nb = len(payload.get("features") or [])
            ns = len(payload.get("processSteps") or [])
            nf = len(payload.get("faqs") or [])
            print(
                f"  [OK ] {slug}  features={nb}  steps={ns}  faqs={nf}"
            )
            ok += 1
    print(f"\nUpdated: {ok}   Failed: {fail}")


if __name__ == "__main__":
    main()
