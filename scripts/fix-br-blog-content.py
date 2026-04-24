"""Clean up BR blog posts in Strapi:
- Delete WordPress artifacts (admin, uncategorized, 404 pages)
- Delete bare-slug duplicates (keep only -br variants)
- Rewrite the 9 legitimate -br posts with clean titles, excerpts, and
  SEO/AEO-optimized body content (markdown), metaTitle and metaDescription.

Usage:  python scripts/fix-br-blog-content.py
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


def http(method: str, path: str, body=None):
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
        return {"__error": f"HTTP {e.code}: {e.read().decode('utf-8','replace')[:200]}"}


# ─── Entries to delete ─────────────────────────────────────────────────────
# 10 bare-slug duplicates + 3 -br artifacts = 13 total
DELETE_IDS = [
    # WordPress artifacts (bare + -br)
    ("xw93ou2qyvzdtumedbm49bup", "admin_br"),
    ("b4mmkdvc66qutx8p639qa4au", "uncategorized"),
    ("crkrksb0cekxuplx1m86585o", "404-page"),
    ("o1hd0pr1p4fkkckvap52cuha", "admin_br-br"),
    ("ue4vmdx1s9ma73bhk566c27v", "uncategorized-br"),
    ("c89wfbo17twouk0zaqad6ewi", "404-page-br"),
    # Bare-slug duplicates of legit articles
    ("jwzzi9d3xawys27wfhbpq2wf", "why-are-harmonic-analysis-...-brazil"),
    ("elrlftgkeprntx100a36wq08", "assessing-and-lowering-...-crucial"),
    ("ckvqmlgidncsy42lchk1rsoq", "load-flow-short-circuit-relay"),
    ("cxzxbn71s2slel52y1f2fwv5", "harmonic-analysis-of-brazil-power-system"),
    ("wdluew2lf3d20j9qn2pqlrg4", "how-can-efficiency-commercial-motors"),
    ("pacf4gk0v2atz7tcttjb6ubl", "how-to-perform-power-quality"),
    ("amg8j8f1a0b9du8iylcvklvp", "principles-of-power-quality"),
]


# ─── Updates: 9 legitimate -br entries ────────────────────────────────────
# Rewrites source machine-translated prose into clear, SEO/AEO-optimized
# markdown while preserving factual content from the WordPress site.

POSTS = {
    "arc-flash-analysis-in-brazil-a-detailed-guide-br": {
        "documentId": "pnltxsfe99ziim6dku2wkcsq",
        "title": "Arc Flash Analysis in Brazil: A Detailed Guide",
        "metaTitle": "Arc Flash Analysis in Brazil: Complete Guide | Carelabs",
        "metaDescription": "Arc flash analysis identifies electrical hazards and defines PPE requirements. Learn the 5-step risk mitigation process for Brazilian facilities.",
        "category": "Arc Flash Study",
        "excerpt": "Arc flash events can produce temperatures above 19,000 °C and cause severe burns, toxic fumes, and blast injuries. Here is the five-step framework Carelabs engineers use to identify, control, and mitigate arc flash risk in Brazilian facilities.",
        "seoKeywords": [
            "arc flash analysis Brazil",
            "NR-10 compliance",
            "IEEE 1584",
            "arc flash hazard assessment",
            "PPE selection arc flash",
            "Carelabs Brazil",
        ],
        "body": """## What is an arc flash?

An arc flash is the light and heat produced when current jumps between conductors through an air gap. The discharge ionises the surrounding air, making it conductive and sustaining the arc. Temperatures at the arc can exceed 19,000 °C — hot enough to vaporise copper, ignite clothing, and cause third-degree burns at distance.

## Why arc flash analysis matters

Arc flash incidents create three categories of harm:

- **Human injury** — severe burns, hearing loss, eye damage, and respiratory injury from inhaled hot gases.
- **Equipment damage** — switchgear destruction, panel rupture, and downtime during rebuilds.
- **Commercial loss** — medical costs, worker's compensation, litigation, OSHA-equivalent fines, and reputational damage that can cost far more than the incident itself.

An arc flash study quantifies the incident energy available at every piece of electrical equipment, sets safe approach boundaries, and defines the PPE category workers must wear when working on or near energised parts.

## Common causes

- Failed conductor insulation
- Dust, moisture, or corrosion inside enclosures
- Dropped tools or fasteners bridging live parts
- Poor maintenance of breakers, switches, and relays
- Mis-rated or defective equipment
- Human error during testing or racking

## The five-step arc flash risk framework

### Step 1 — Identify the hazard

Build a detailed electrical model of the facility. This requires data collection, single-line diagrams, short-circuit analysis, protective-device coordination, and incident-energy calculations — typically in software such as ETAP.

### Step 2 — Manage exposure

Work on de-energised equipment wherever possible. Replace manual racking with remote-operated systems. Install physical barriers between workers and live parts.

### Step 3 — Engineering controls

Reduce incident energy at the source: lower short-circuit current, install arc-flash detection and suppression, upgrade switchboards, add bus insulation, and tune protective-device settings so faults clear faster.

### Step 4 — Administrative controls

Apply incident-energy labels to every piece of equipment. Define arc-flash boundaries. Publish electrical work permits. Train personnel annually. Document every study in your safety program.

### Step 5 — Personal protective equipment

PPE is the last line of defence, not the first. Select arc-rated clothing, face shields, gloves, and hearing protection based on the calculated incident energy for each task.

## What Carelabs delivers

Every Carelabs arc flash study ships with:

- Power-system model built in ETAP
- Short-circuit and overcurrent coordination analysis
- Incident-energy calculations at every relevant bus
- Equipment labels ready to apply
- One-line diagrams updated to current state
- Mitigation recommendations with cost-benefit ranking
- A final report aligned with IEEE 1584 and NR-10

Our engineers are ISO 9001:2008-accredited and serve São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major industrial centre in Brazil. [Request a free arc flash study quote](/br/contact-us/) or [explore our arc flash service page](/br/arc-flash-study/).
""",
    },
    "assessing-and-lowering-the-danger-of-an-arc-flash-is-crucial-br": {
        "documentId": "qh5b9jh5075lua1gufx71okb",
        "title": "Assessing and Lowering the Danger of an Arc Flash",
        "metaTitle": "How to Assess and Reduce Arc Flash Risk | Carelabs Brazil",
        "metaDescription": "Arc flash events can reach 20,000 °C. Learn how to identify hazards, apply engineering controls, and protect your workforce in Brazilian facilities.",
        "category": "Arc Flash Study",
        "excerpt": "Arc flash incidents damage lives, equipment, and reputations. This guide walks through the direct and indirect costs of an arc flash and the five practical steps a facility can take to bring the risk down.",
        "seoKeywords": [
            "arc flash risk assessment",
            "arc flash mitigation",
            "NR-10 Brazil",
            "electrical safety program",
            "arc-resistant switchgear",
        ],
        "body": """## Why arc flash risk deserves board-level attention

Electrical arcs form when voltage across a gap ionises the air between two conductors. Once the air turns conductive, current flows through the plasma and generates extreme heat — typically up to 20,000 °C at the arc. The light, pressure wave, and flying molten metal make arc flash one of the most dangerous failure modes in industrial electrical systems.

## The real cost of an arc flash incident

### Direct costs

- Medical care and rehabilitation for injured workers
- Worker's compensation claims
- Accident investigation and production downtime

### Indirect costs

- Legal fees, settlements, and regulatory fines
- Higher insurance premiums
- Equipment replacement and rebuild time
- Contract-worker costs during recovery

### Reputational costs

A visible safety incident damages employer brand, customer trust, and — in worst cases — leads to the suspension of an electrical contractor's license. Incident-free operation is now a commercial differentiator, not a nice-to-have.

## What causes most arc flash incidents

- Testing or racking on the wrong surface or with the wrong probe
- Inappropriate equipment ratings or improper installation
- Damaged insulation, conductor gaps, or panel obstructions
- Accumulated dust, rust, or moisture inside enclosures
- Poor circuit-breaker and switch maintenance
- Frayed connections or energised components left exposed

## Five mitigation strategies that work

### 1. De-energise whenever possible

The single most effective step. Avoid energised work. When re-energising, test first with remote tools and observe approach boundaries.

### 2. Adopt low-risk technology

Remote racking systems, arc-flash detection relays, and infrared inspection windows keep operators outside the arc-flash boundary during routine tasks.

### 3. Redesign the system for lower incident energy

Configure protective devices for faster clearing times. Use current-limiting breakers. Segment the bus. Ensure PPE categories are matched to the actual hazard level of each task.

### 4. Reduce available fault current

Non-current-limiting breakers, bus segmentation during maintenance, and current-limiting reactors all reduce the energy available to feed an arc.

### 5. Deploy arc-resistant switchgear

Arc-resistant designs use sealed joints, top-mounted pressure-relief vents, and reinforced hinges to channel arc energy away from personnel through ducts to a safe area.

## How Carelabs runs an assessment

Our engineers assess the current state of your safety program, model the system in ETAP, calculate incident energy at every bus, and recommend mitigation ranked by cost and impact. Carelabs is ISO 9001:2008-accredited and delivers arc flash assessments across São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region.

[Book a free consultation](/br/contact-us/) or [read more about our arc flash service](/br/arc-flash-study/).
""",
    },
    "how-can-efficiency-and-reliability-of-commercial-motors-be-evaluated-br": {
        "documentId": "jkn72fzd8kygsoddzu1k622p",
        "title": "How to Evaluate Commercial Motor Efficiency and Reliability",
        "metaTitle": "Evaluating Commercial Motor Efficiency & Reliability | Carelabs Brazil",
        "metaDescription": "Motors use 46% of industrial electricity. Learn the four factors that govern motor performance and the audit process Carelabs uses to cut losses in Brazilian plants.",
        "category": "Motor Analysis",
        "excerpt": "Industrial motors consume nearly half of all electricity used in manufacturing. Small gains in motor efficiency translate directly to lower energy bills and higher reliability. Here is how Carelabs audits commercial motors and what to ask for in your next assessment.",
        "seoKeywords": [
            "motor efficiency audit",
            "commercial motor reliability",
            "motor performance Brazil",
            "energy efficiency industrial motors",
            "Carelabs Brazil",
        ],
        "body": """## Why motor efficiency is a bottom-line issue

In industrial plants, motors draw **46% of total electricity** and **69% of total energy** consumed. Peak efficiency sits around 75% of rated load, and efficiency drops off as motors age. Poor motor design and operation — oversized motors, unmatched loads, power-quality problems — are among the fastest drivers of rising energy bills.

The upside: an audit that cuts losses by even a few percentage points pays for itself within a year on most production lines.

## Four factors that govern motor performance

### 1. Power quality

Transients, voltage imbalance, sags, swells, and harmonics create heating, torque pulsation, and insulation stress. Poor power quality is often the hidden cause of "mystery" motor failures.

### 2. Torque characteristics

A motor's torque–speed curve determines whether it can start the load, hold speed under disturbance, and ride through voltage dips. Measured torque is one of the clearest indicators of motor health.

### 3. Load matching and operating point

Motors overloaded mechanically stress bearings, couplings, and insulation. Motors lightly loaded run below their efficiency sweet spot and waste energy.

### 4. Maintenance baseline

Predictive maintenance starts with baseline efficiency data. Without a reference point, you cannot tell whether a motor is drifting toward failure.

## The failure statistics you should know

- **75% of industrial motor failures cause 1–6 days of plant downtime per year.**
- 90% of motor breakdowns show warning signs less than a month in advance.
- 36% of breakdowns progress from first symptom to failure in under 24 hours.

Regular inspection, inline testing, and corrective analysis cut this downtime dramatically.

## The Carelabs motor audit process

1. **Document review** — collect drawings, nameplate data, and service history.
2. **Single-line diagram and checklist** — build a current-state reference.
3. **On-site inspection** — walk the installation and complete the checklist.
4. **Testing** — electrical and mechanical testing under representative load.
5. **Data capture** — record voltage, current, power factor, vibration, temperature.
6. **Cross-check against load flow and power quality** — confirm supply is healthy.
7. **Corrective recommendations** — any issue found is scoped with a fix.
8. **Compliance check** — verify efficiency meets national standards.
9. **Digital report** — delivered with prioritised action list and safe-work notes.

## Why work with Carelabs

- Accountable engineering — we own the outcome.
- Familiarity with Brazilian standards and local utility conventions.
- Digital, audit-ready reports.
- Coverage across São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major industrial region.

[Request a motor efficiency audit](/br/contact-us/) or [see our motor start analysis service](/br/motor-start-analysis/).
""",
    },
    "why-are-harmonic-analysis-and-study-important-for-businesses-in-brazil-br": {
        "documentId": "nvn5xrpdam1tswfted7wvd9k",
        "title": "Why Harmonic Analysis Matters for Brazilian Businesses",
        "metaTitle": "Why Harmonic Analysis Matters in Brazil | Carelabs",
        "metaDescription": "Harmonic distortion cuts equipment lifespan and raises utility costs. Learn when to measure harmonics and how Carelabs engineers mitigate them in Brazilian facilities.",
        "category": "Harmonic Analysis",
        "excerpt": "Harmonic distortion shortens equipment life, raises energy bills, and increases the risk of equipment failure. Here is when to measure harmonics, what good looks like, and the workflow Carelabs engineers use to bring distortion back within limits.",
        "seoKeywords": [
            "harmonic analysis Brazil",
            "power quality",
            "THD limits",
            "point of common coupling",
            "ETAP harmonic study",
        ],
        "body": """## What harmonics do to your power system

An ideal supply delivers a clean sinusoidal voltage. In real facilities, nonlinear loads — variable-speed drives, switched-mode power supplies, LED lighting, UPS systems — pull current in short bursts that distort the waveform. That distortion is measured as **total harmonic distortion (THD)**.

Persistent harmonic distortion above the limits causes:

- Additional Joule-effect losses inside conductors, transformers, and motors
- Higher subscribed-power billing from the utility
- Equipment that must be oversized to stay within thermal limits
- Component lifespan reductions once distortion reaches ~10% THD
- Peak currents that trip protective devices and idle production

## When to run a harmonic study

Most facilities stay safe with up to **15% nonlinear load** on the bus. Above that threshold, distortion rises fast. Order a harmonic study when any of these is true:

- Nonlinear load exceeds 15% of total bus load
- You are about to add a variable-speed drive, UPS, or rectifier system
- A capacitor bank is being added or resized
- Equipment is overheating without an obvious cause
- Protective devices are tripping with no upstream fault

## The Carelabs harmonic analysis workflow

1. **Collect the single-line diagram.** Mark every nonlinear load, capacitor bank, and long medium-voltage cable.
2. **Identify the point of common coupling (PCC).** This is where utility harmonics meet facility harmonics.
3. **Flag sensitive buses** — distribution boards feeding precision equipment or protective relays.
4. **Gather harmonic data** for every nonlinear load (typical or measured spectra).
5. **Pull utility data** at the PCC — short-circuit fault levels, allowable current and voltage distortion.
6. **Model the network in ETAP** and run the harmonic analysis.
7. **Calculate individual and total distortion** at each bus and the PCC.
8. **Plot the spectrum** to identify dominant harmonic orders.
9. **Design mitigation** — passive filter, active filter, or drive-side reactor — when limits are exceeded.
10. **Re-run the analysis** with mitigation modelled to verify compliance.

## What changes after mitigation

- Lower conductor and transformer heating
- Higher effective power factor and smaller reactive-power bills
- Extended capacitor-bank, motor, and transformer service life
- Fewer nuisance breaker trips
- Cleaner supply for sensitive equipment

## Why Brazilian facilities work with Carelabs

ISO 9001:2008-accredited engineers, ETAP-based modelling, and coverage across São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major industrial region. [Request a harmonic study quote](/br/contact-us/) or [learn more about our harmonic service](/br/harmonic-study-and-analysis/).
""",
    },
    "harmonic-analysis-of-the-brazil-power-system-br": {
        "documentId": "pin3ye6e9os17d5b1lfo9o00",
        "title": "Harmonic Analysis of the Brazil Power System",
        "metaTitle": "Harmonic Analysis of Brazil Power Systems | Carelabs",
        "metaDescription": "Harmonics raise RMS current, overheat transformers, and damage sensitive equipment. Here is how harmonic analysis works — and when your Brazilian facility needs one.",
        "category": "Harmonic Analysis",
        "excerpt": "Harmonics raise the RMS current on every cable, transformer, and motor they pass through. The effects — overheating, nuisance tripping, shortened lifespan — are often mistaken for normal ageing. This article explains how to tell harmonic distortion apart and how to fix it.",
        "seoKeywords": [
            "harmonic distortion",
            "power system analysis Brazil",
            "nonlinear loads",
            "ETAP",
            "capacitor bank harmonics",
        ],
        "body": """## Why harmonics deserve their own study

Every modern facility runs on electricity, and most modern loads — computers, LED lighting, variable-speed drives, rectifiers, UPS systems — are nonlinear. Nonlinear loads distort the supply waveform and inject harmonic currents back into the network. Those harmonics raise the RMS current on every cable, transformer, and motor between the load and the utility transformer.

The effects can be subtle at first: slightly elevated transformer temperature, a breaker that trips unexpectedly, a motor that ages faster than its twin on the next line. Over time, these add up to real losses.

## What harmonic distortion actually is

Harmonic distortion is a non-sinusoidal deviation in the voltage or current waveform. It is caused by loads that draw current in pulses — switched-mode power supplies, SMPS, drives, UPS equipment, fluorescent and LED lighting, and electronically-controlled motors.

Once distortion exists, it propagates through the power system and affects every piece of equipment downstream.

## Why harmonic analysis matters

A harmonic study quantifies distortion, identifies the dominant orders, and tells you whether your facility is within the 5–8% THD ceilings specified by international standards such as **IEEE 519** and aligned locally with **ABNT NBR** guidance. Without the study, you are guessing.

## When to run a study

- Nonlinear load exceeds 25% of any circuit or bus
- You are diagnosing unexplained equipment damage or breaker trips
- The plant is being expanded with new drives, rectifiers, or UPS
- A capacitor bank is being added — capacitors can resonate with system inductance at specific harmonic frequencies

## How harmonics affect different equipment

| Equipment | Harmonic effect |
|-----------|-----------------|
| Rotating machines | Increased cable resistance, rotor losses, overheating, torque pulsation |
| Transformers and cables | Overheating, neutral-conductor overload, higher losses |
| Capacitor banks | High circulating currents, insulation breakdown, resonance |
| Power electronics | Reduced efficiency, component failure |
| Protective relays | Misoperation and nuisance tripping |

## The benefits of mitigation

- Lower conductor, switchgear, and transformer losses — directly reducing energy bills
- Lower RMS current means smaller cables, switchgear, and busbars on future upgrades
- Less overheating means longer life for motors, capacitors, and transformers
- Fewer unplanned shutdowns and fewer missed-production incidents

## The Carelabs workflow

1. Obtain the single-line diagram and mark nonlinear loads.
2. Locate the point of common coupling (PCC).
3. Highlight sensitive plant buses.
4. Collect harmonic data for every nonlinear load plus utility background levels.
5. Model the system in ETAP.
6. Measure voltage and current distortion at each bus.
7. If distortion exceeds limits, design a mitigation strategy — passive filter, active filter, or drive-side reactor.
8. Re-run the analysis to verify compliance.

Carelabs equips engineers with ETAP and modern instrumentation to deliver risk-free, ABNT-aligned harmonic assessments. [Request a quote](/br/contact-us/) or [see our harmonic service page](/br/harmonic-study-and-analysis/).
""",
    },
    "principles-of-power-quality-work-in-brazil-br": {
        "documentId": "l5jw3k6xt2l5iueb2gm3tkxj",
        "title": "Principles of Power Quality Work in Brazil",
        "metaTitle": "Principles of Power Quality Work in Brazil | Carelabs",
        "metaDescription": "Voltage stability, imbalance, harmonics, and sags are the four pillars of power quality. Here is how Carelabs engineers measure and fix each one in Brazilian facilities.",
        "category": "Power Quality",
        "excerpt": "Power quality issues — voltage dips, imbalance, harmonics, flicker — cause equipment damage, production loss, and safety incidents. This guide explains the four main categories and how Carelabs measures and mitigates each.",
        "seoKeywords": [
            "power quality Brazil",
            "voltage imbalance",
            "voltage sag analysis",
            "current harmonics",
            "ABNT NBR 5410",
        ],
        "body": """## Why power quality matters

The quality of the power supply directly determines whether the equipment connected to it performs as designed and lives out its rated lifespan. A network with clean, stable voltage keeps production running. A network with poor power quality slowly degrades every motor, drive, and sensitive electronic controller on the floor — often without an obvious culprit.

Unlike **reliability** (which measures long-duration outages), power-quality disturbances can be silent. Equipment may degrade for years before anyone notices.

## The business cost of poor power quality

### Direct economic impact

- Lost production
- Process-restart costs
- Equipment damage and repair
- Breakdowns and delays
- Safety and health concerns
- Contract penalties for missed deliveries
- Environmental fines when processes escape control

### Indirect economic impact

- Delayed revenue recognition
- Market-share loss to competitors with better reliability
- Brand-value damage after repeated incidents

### Social impact

- Building temperature excursions during outages
- Worker injury or anxiety
- Electrical hazards created by undetected disturbances

## The five power-quality issues every facility should track

### 1. Voltage stability

Steady-state voltage magnitude sustained for minutes or hours. Over- and under-voltage drive equipment failure, higher energy consumption, and system malfunction.

### 2. Voltage imbalance

Unequal voltages across three phases. Causes:

- Reverse torque in induction motors
- Stator and rotor overheating
- Reduced cable capacity
- Extra losses on the neutral conductor
- Higher cable energy losses

### 3. Current harmonics

Nonlinear loads inject harmonic currents back into the supply. Computers, variable-speed drives, and discharge lamps are the main culprits. Harmonics damage installations, overload neutrals, and reduce effective capacity.

### 4. Voltage flicker

Envelope modulation of the voltage waveform — typically from arc furnaces, welders, or large intermittent loads. Causes cyclic light-output changes that range from mildly annoying to medically significant.

### 5. Voltage dips and interruptions

Short-term RMS decreases lasting half a cycle to a full minute. Most equipment rides through short dips, but longer interruptions drop production. Cost scales logarithmically with duration.

## How Carelabs fixes power-quality problems

- **Load flow analysis** — magnitudes of power flow, voltage levels, power factor, and losses.
- **Harmonic analysis** — identify, predict, and mitigate harmonic issues.
- **Surge and transient analysis** — locate the source of fast events.
- **Voltage analysis** — track sags, swells, imbalance, and steady-state variation over time.
- **Reactive power study** — size capacitor banks and reactive compensation at load and distribution ends.
- **Energy synchronisation** — measure captive power and reduce surcharges.

Every study uses ETAP for system modelling and is delivered as a digital report with prioritised recommendations. Carelabs serves São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region.

[Schedule a power quality assessment](/br/contact-us/) or [see our power quality service](/br/power-quality-analysis/).
""",
    },
    "how-to-perform-a-power-quality-analysis-in-brazil-br": {
        "documentId": "fhocaokm1kdpjvqj1c9sh5k3",
        "title": "How to Perform a Power Quality Analysis in Brazil",
        "metaTitle": "How to Run a Power Quality Analysis in Brazil | Carelabs",
        "metaDescription": "A step-by-step guide to running a power quality analysis on Brazilian industrial facilities — from survey scope to final report.",
        "category": "Power Quality",
        "excerpt": "A power quality analysis measures voltage stability, frequency, harmonics, and transients to identify the supply issues that drive equipment failure. Here is the five-step process Carelabs engineers follow on every Brazilian assessment.",
        "seoKeywords": [
            "power quality analysis",
            "voltage stability Brazil",
            "harmonic deformation",
            "power analyzer",
            "ABNT NBR",
        ],
        "body": """## What power quality really measures

Power quality is the ability of connected equipment to use the energy delivered to it. When power quality is poor, you see:

- High energy consumption per unit of production
- Rising maintenance cost on motors and electronics
- Unplanned downtime
- Equipment instability
- Higher failure rates on sensitive controllers

A proper power quality analysis identifies which of those symptoms is caused by the supply — and which is caused by the load — so fixes go in the right place.

## The two categories of power-quality variation

### Disruptions

Irregularities in voltage or current. Transient voltages exceed peak magnitude thresholds. RMS fluctuations — sags, surges, interruptions — cross predetermined limits.

### Steady-state variations

Continuous conditions: RMS voltage shifts, sustained imbalance, and harmonic wave distortion. These are measured over time and characterised statistically.

## What a power quality analysis examines

- **Voltage stability** — steady-state level and slow variation
- **Supply frequency** — alternation rate of the voltage waveform
- **Voltage dips and swells** — fast RMS changes
- **Voltage spikes and transients** — sub-cycle peak events
- **Harmonic deformation** — waveform distortion from nonlinear loads
- **Radio-frequency interference** — high-frequency noise riding on the supply

Most of these require specialised test equipment and a certified technician to capture and interpret correctly.

## The Carelabs five-step procedure

### Step 1 — Define the scope

Agree on the objectives of the survey with the plant team. Which buses? Which loads? What symptoms are you trying to explain? Budget and time follow from this scope.

### Step 2 — Draw the single-line schematic

Capture the complete electrical system from the utility point of supply to the critical loads. Mark transformers, major breakers, capacitor banks, and VSDs.

### Step 3 — Instrument the system

Connect power-quality analysers at the PCC and at every critical distribution board. Capture voltage, current, power factor, THD, and transients for a representative period — typically 7 to 14 days so you sample every shift and every load profile.

### Step 4 — Analyse the data

Correlate events with production logs. A sag at 02:14 on Tuesday night has a specific cause; finding that cause is the job. Compare measurements against ABNT NBR 5410 and IEEE 519 limits.

### Step 5 — Deliver the report

A power-quality report tells three stories: what the measurements show, which problems those measurements explain, and what it will cost to fix them — ranked by ROI.

## Why work with Carelabs

Carelabs engineers are trained to separate utility-side problems from facility-side problems, which matters because the fix is different for each. We deliver power-quality assessments across São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major Brazilian industrial region.

[Book a power quality survey](/br/contact-us/) or [see our power quality service](/br/power-quality-analysis/).
""",
    },
    "why-load-flow-and-short-circuit-analysis-important-for-brazilian-business-br": {
        "documentId": "y2vf1cjcj71ldthw390c0912",
        "title": "Why Load Flow and Short Circuit Analysis Matter in Brazil",
        "metaTitle": "Load Flow & Short Circuit Analysis in Brazil | Carelabs",
        "metaDescription": "Load flow and short circuit analysis prove your power system can survive full load and fault conditions. Here is why every Brazilian facility needs both.",
        "category": "Power System Analysis",
        "excerpt": "A load flow study shows whether your power system can carry full load. A short circuit study shows whether it can survive a fault. Brazilian industrial facilities need both — and this article explains why.",
        "seoKeywords": [
            "load flow analysis Brazil",
            "short circuit study",
            "power system analysis",
            "ETAP Brazil",
            "breaker interrupting capacity",
        ],
        "body": """## Two studies, two very different questions

A **load flow analysis** answers: "Can the system carry the load I plan to put on it?" It calculates voltage, current, power factor, and losses at every node under normal operation.

A **short circuit study** answers: "Can the system survive a fault without catastrophic damage?" It quantifies the fault current at every point and checks that every breaker can interrupt that current safely.

Every industrial or commercial facility in Brazil should have both on file — and should refresh them whenever the load mix, transformer, or generation scheme changes.

## What a short circuit can do

Without proper analysis, a short circuit can produce:

- Equipment damage from through-fault currents that exceed rated withstand
- Overheating of cables, busbars, and transformers
- Fire or explosion at the fault point
- Extended downtime while the system is rebuilt
- Severe injury to nearby personnel

## Three common short-circuit causes

### Insulation defects

Current finds a path through failed or contaminated insulation. Neutral wires carrying current they were not sized for overheat and fail.

### Loose connections

Slack wiring allows current to leak into grounded or neutral components.

### Faulty outlets or receptacles

Downstream equipment plugged into damaged receptacles short out the feeder.

## How Carelabs uses load flow and short circuit analysis

Carelabs engineers build an ETAP model of the facility and run both studies together. Load flow identifies bottlenecks — overloaded transformers, overloaded feeders, voltages outside ±5% limits. Short circuit identifies breakers operating above their interrupting rating, bus-bracing problems, and protection-coordination gaps.

The output is a single, actionable report: ranked list of issues, recommended fixes, and documentation you can hand to insurers and auditors.

## What you get from Carelabs

- Transparent pricing with no size-based hidden fees
- ETAP-based simulations that match real-world measurements
- Digital reports with engineer commentary
- Follow-up support for every issue we identify
- Pre-commissioning verification before systems are energised
- Fast response on new enquiries

We serve São Paulo, Rio de Janeiro, Brasília, Salvador, and every other major industrial region in Brazil.

[Request a quote](/br/contact-us/) or [read about our power system service](/br/power-system-study-and-analysis/).
""",
    },
    "load-flow-short-circuit-and-relay-coordination-in-power-system-analysis-br": {
        "documentId": "l0b121m790d43s7puizjvnhu",
        "title": "Load Flow, Short Circuit & Relay Coordination in Power System Analysis",
        "metaTitle": "Load Flow, Short Circuit & Relay Coordination | Carelabs Brazil",
        "metaDescription": "Three studies, one system: load flow, short circuit, and relay coordination together prove your power system is safe, selective, and dependable.",
        "category": "Power System Analysis",
        "excerpt": "Load flow, short circuit, and relay coordination studies together answer the three questions every facility needs answered: can it carry the load, survive a fault, and clear that fault selectively? Here is how Carelabs engineers run all three.",
        "seoKeywords": [
            "power system analysis Brazil",
            "relay coordination",
            "Gauss-Seidel",
            "Newton-Raphson",
            "ETAP load flow",
        ],
        "body": """## The three questions every plant needs answered

A complete power system analysis combines three separate studies that each answer a different question:

- **Load flow** — can the system carry the load it is asked to carry?
- **Short circuit** — can the system survive a fault without catastrophic damage?
- **Relay coordination** — when a fault happens, does the nearest breaker open *first*?

Get all three right and you have a power system that is safe in normal operation, survivable under fault, and selective when things go wrong. Miss one and the other two are compromised.

## Load flow study and analysis

A load flow study calculates:

- Active and reactive power generated at every source
- Real and reactive losses on every line and transformer
- Voltage magnitude and angle at every bus
- Power factor at every major load
- Line currents and loading percentages

### The three-phase workflow

1. Model the network and components.
2. Formulate the load-flow equations.
3. Solve the equations numerically.

### The three common numerical methods

**Gauss-Seidel** — simple to implement, low memory, but slow to converge on large systems.

**Newton-Raphson** — more complex code, but quadratic convergence and high accuracy even with regulating transformers and awkward slack-bus selection. Requires more memory.

**Fast Decoupled Load Flow (FDLF)** — lowest memory footprint, roughly five times faster than Newton-Raphson, making it the preferred choice for real-time grid operations. Less general; harder to adapt to non-standard problems.

## Short circuit study and analysis

A short circuit study evaluates four fault types:

- **Line-to-line** — two phases shorted
- **Single line-to-ground** — one phase to earth
- **Double line-to-ground** — two phases and ground together
- **Three-phase** — all three phases faulted

The engineer builds an impedance diagram from the single-line drawing and calculates the short-circuit current, transformer multiplier, and full-load amps at every point. Those numbers are then compared against breaker interrupting ratings and cable short-time ratings. Anywhere the fault current exceeds the rating is a safety finding.

## Relay coordination analysis

Relay coordination is the art of making sure the breaker *nearest* the fault trips before any upstream breaker. Coordination lets the rest of the plant keep running during a fault and isolates damage to the smallest possible zone.

The workflow:

1. Run the short-circuit analysis first — coordination is built on top of it.
2. Model every protective device with its time–current characteristic curve.
3. Plot curves together and check for overlap or crossed coordination.
4. Adjust pickup, time dial, and definite-time settings until every pair is selective.
5. Document final settings and issue relay setting sheets to the operations team.

## The benefits of a complete power system analysis

- Higher grid reliability
- Correctly rated equipment — no oversized capital and no undersized risk
- Quantified safety margins on incident energy and fault current
- Compliance with ABNT NBR 5410 and international standards
- A documented baseline for every future upgrade
- Ranked mitigation options for any problem identified

## Why work with Carelabs

Carelabs delivers load flow, short circuit, and relay coordination as a single engagement on Brazilian industrial sites. Our engineers use ETAP, provide digital reports, and respond to new enquiries within 24 hours.

[Get a quote](/br/contact-us/) or [see our power system service](/br/power-system-study-and-analysis/).
""",
    },
}


# ─── Run ───────────────────────────────────────────────────────────────────

def main():
    print("=" * 72)
    print("STEP 1 — Delete 13 artifacts / duplicates")
    print("=" * 72)
    deleted = failed_delete = 0
    for doc_id, label in DELETE_IDS:
        r = http("DELETE", f"/api/blog-posts/{doc_id}")
        if "__error" in r:
            print(f"  [ERR] {label} ({doc_id}): {r['__error']}")
            failed_delete += 1
        else:
            print(f"  [OK ] deleted {label} ({doc_id})")
            deleted += 1

    print(f"\nDeleted: {deleted}   Failed: {failed_delete}")

    print()
    print("=" * 72)
    print("STEP 2 — Update 9 legitimate -br posts with clean content")
    print("=" * 72)
    updated = failed_update = 0
    for slug, payload in POSTS.items():
        doc_id = payload.pop("documentId")
        r = http("PUT", f"/api/blog-posts/{doc_id}", payload)
        if "__error" in r:
            print(f"  [ERR] {slug}: {r['__error']}")
            failed_update += 1
        else:
            print(f"  [OK ] {slug}  ->  {payload['title']}")
            updated += 1

    print(f"\nUpdated: {updated}   Failed: {failed_update}")
    print()
    print("Done.")


if __name__ == "__main__":
    main()
