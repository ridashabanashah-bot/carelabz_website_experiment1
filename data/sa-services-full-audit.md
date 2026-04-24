# Carelabs South America — Full Service Page Content Audit

**Scope:** 5 countries × 5 services = 25 service pages from `www.carelabz.com/{cc}/` WordPress source.
**Extracted:** 2026-04-25 via WebFetch.
**Purpose:** Ground-truth reference for Strapi CMS population and editorial rewrites.

---

# Executive Summary

## 1. Content is fully templated across all 5 countries

Every South American country WordPress site uses the **same 5 service pages with identical body prose**, swapping only three variables:

| Variable | BR | CO | CL | AR | PE |
|---|---|---|---|---|---|
| Country name | Brazil | Colombia | Chile | Argentina | Peru |
| Adjective | Brazilian | Colombian | Chilean | Argentine | Peruvian |
| City list (4) | São Paulo, Rio de Janeiro, Brasília, Salvador | Bogotá, Medellín, Cali, Barranquilla | Santiago, Valparaíso, Concepción, Viña del Mar | Buenos Aires, Córdoba, Rosario, Mendoza | Lima, Arequipa, Trujillo, Chiclayo |

Section headings, bullet lists, workflow steps, benefit lists, and body paragraphs are verbatim identical across all 5 countries after country-name substitution. This confirms the pattern we used for the Strapi content migration (single BR template, parameterised per country).

## 2. Standards mentioned — only ISO 9001:2008

Across all 25 service pages, the only standard/certification referenced is **ISO 9001:2008**. **ETAP** is mentioned as the software tool. No country-specific electrical code (NR-10 / ABNT NBR 5410 / RETIE / NCh Elec. / AEA 90364 / RM 111-2013-MEM / CNE / NTC 2050) appears anywhere on the WordPress source — despite those being the actual regulatory frameworks.

Our Strapi content has been rewritten to include the correct per-country standards. Do **not** rely on WordPress as the source of truth for regulatory references.

## 3. No FAQ, no meta description, no author, no dates

- No FAQ section exists on any of the 25 service pages
- No `meta name="description"` tag on any page
- No author or publishedDate exposed in HTML
- No real image URLs — source uses lazy-loaded SVG placeholders

The Strapi entries now carry authored FAQ, metaDescription, etc. — none of that data was inherited from WordPress.

## 4. Source bugs worth flagging

### Bug A — CO power-quality page references "Peru"
`www.carelabz.com/co/power-quality-analysis/` contains a section headed "**Peru Must Investigate Power Quality**" followed immediately by an identical section "**Colombia Must Investigate Power Quality**". The CO page was forked from PE and the editor missed the country-name swap on that one heading. Worth a note for anyone re-reading the live site.

### Bug B — Motor Start Analysis section repeated
On every country's `motor-start-analysis/` page, the "When Should a Motor Start Analysis Be Performed?" section appears twice with identical content. Authoring error replicated across all 5 countries.

### Bug C — Missing country-specific regulatory standards
No country's service page mentions its own regulatory framework, which is the single biggest content gap on the source site.

## 5. Machine-translated prose

Body prose is stilted throughout — "Launching the automobile" instead of "Motor starting", "Launching the engine", "Carrying a burden" instead of "Load flow", etc. Recommend authored rewrites rather than verbatim copies. Our Strapi content already applies that rewrite.

## 6. Variable content per country — only these
- Hero paragraph country phrase ("for businesses in {country}")
- Service coverage closing line (city list)
- One mid-page heading per service ("{country} Must Investigate…" / "Motor Start Analysis is Required in {country}")

Everything else is byte-identical.

---

# Template Map — which paragraphs match across countries

For every service, each page consists of roughly this outline. Variable parts marked `{country}` / `{cities}`.

### Arc Flash Study
1. H1 "Arc Flash Study"
2. Eyebrow: "Get Your Arc Flash Study Report Now"
3. Hero: "CareLabs is an economical supplier of electrical arc flash analysis…for businesses of all type{s}."
4. Overview paragraph (ETAP, 35,000 °F, incident energy) — identical all countries
5. Arc Flash Research Objectives — 5-bullet list identical
6. Adverse Consequences — 3-bullet list identical
7. Arc Flash Studies Importance — identical paragraph
8. Arc Flash Research Benefits — 4-bullet list identical
9. Procedures for Arc Flash Analysis — 4-bullet list identical
10. CareLabs Work Method — 11-bullet list identical
11. Advantages of Using CareLabs Services — 7-bullet list identical
12. Service Coverage: "ISO 9001:2008-accredited… In addition to {cities}…"

### Harmonic Study & Analysis
1. H1 "Harmonic Study and Analysis"
2. Eyebrow: "Get Your Harmonic Study Report Now"
3. Hero: "CareLabs offers electrical installation services…"
4. Overview paragraph — identical (415-volt 5% / 4% / 2% limits)
5. Effects of Harmonic Distortion — 12-bullet list identical
6. Benefits — 5-bullet list identical
7. Harmonic Analysis Workflow — 10-step numbered list identical
8. CareLabs Service Benefits (tiered 25% / 25-75% / upper) — identical
9. Service Coverage: "{cities}"

### Motor Start Analysis
1. H1 "Motor Start Analysis"
2. Hero: "Businesses in {country} may benefit from CareLabs' one-of-a-kind Motor start research and analysis solution."
3. Analysis Methods — 4-bullet list identical
4. "Motor Start Analysis is Required in {country}" — identical body
5. "When Should a Motor Start Analysis Be Performed?" — 5-bullet list identical, **repeated twice (bug)**
6. Analysis Benefits — identical paragraph
7. Service Coverage: "{cities}"

### Power System Study & Analysis
1. H1 "Power System Study and Analysis"
2. Eyebrow: "Get Your Power System Analysis Report Now"
3. Hero: identical
4. Why an Analysis is Necessary — identical paragraph
5. Analysis Components — 9-bullet list identical
6. Load Flow Analysis — identical paragraph
7. Short-Circuit Investigations — identical paragraph
8. Transient Research — identical paragraph
9. Research on Protection Coordination — identical paragraph
10. Essential Functions — 11-bullet list identical
11. CareLabs Components — 7-bullet list identical
12. Service Coverage: "{cities}"

### Power Quality Analysis
1. H1 "Power Quality Analysis"
2. Hero: "CareLabs evaluates the condition of electricity for {adj} enterprises. Our mission is to safeguard…"
3. Opening paragraph — identical
4. Purpose list — 12-bullet list identical
5. "{country} Must Investigate Power Quality" — identical body (**Bug on CO** — section also labeled "Peru" once)
6. Frequency deviations / Voltage disruptions (3 subtypes) / Voltage distortion (2 subtypes) — identical
7. What's Included in Analysis — 6-bullet list identical
8. Closing service coverage with {cities}

---

# BRAZIL (BR) — canonical full content

> Note: BR was already fully extracted to [data/br-content-audit.md](br-content-audit.md) §2 during the earlier BR migration. The full verbatim prose lives there. Reproduced below in compact form, with reference to the existing audit for any paragraph not repeated inline.

## BR.1 — Arc Flash Study
- **URL:** https://www.carelabz.com/br/arc-flash-study/
- **Meta title:** Arc Flash Study Services in Brazil | Care Labs
- **Meta description:** (not set)
- **H1:** Arc Flash Study
- **Eyebrow:** Get Your Arc Flash Study Report Now
- **Hero:** "CareLabs is an economical supplier of electrical arc flash analysis, investigation, and certification services for businesses of all type. Arc flash risks, employee training, paperwork, and PPE (Personal Protective Equipment) requirements will be assessed by skilled specialists to verify that your electrical safety program is up-to-date, compliant, and comprehensive."
- **Cities:** São Paulo, Rio de Janeiro, Brasília, Salvador
- **Standards:** ISO 9001:2008 · ETAP
- **Body:** See [br-content-audit.md §2.1](br-content-audit.md) for the full section-by-section transcript. Structure matches Template Map §Arc Flash Study exactly.
- **FAQs:** None on WP source

## BR.2 — Harmonic Study & Analysis
- **URL:** https://www.carelabz.com/br/harmonic-study-and-analysis/
- **Meta title:** Harmonic Study and Analysis in Brazil | Care Labs
- **Meta description:** (not set)
- **H1:** Harmonic Study & Analysis (navigation label)
- **Eyebrow:** Get Your Harmonic Study Report Now
- **Cities:** São Paulo, Rio de Janeiro, Brasília, Salvador
- **Standards:** ISO 9001:2008 · ETAP
- **Body:** See [br-content-audit.md §2.2](br-content-audit.md).
- **FAQs:** None

## BR.3 — Motor Start Analysis
- **URL:** https://www.carelabz.com/br/motor-start-analysis/
- **Meta title:** Motor Start Analysis Services in Brazil | Care Labs
- **Meta description:** (not set)
- **H1:** Motor Start Analysis
- **Hero:** "Carelabs offers organizations in Brazil a specialized Motor start study and analysis solution. The major objective of our motor start analysis service is to assess the atypical effects of starting a big motor."
- **Cities:** São Paulo, Rio de Janeiro, Brasília, Salvador
- **Standards:** none mentioned on WP
- **Body:** See [br-content-audit.md §2.5](br-content-audit.md).
- **FAQs:** None
- **Note:** "When Should a Motor Start Analysis Be Performed?" section repeated twice — source bug

## BR.4 — Power System Study & Analysis
- **URL:** https://www.carelabz.com/br/power-system-study-and-analysis/
- **Meta title:** Power System Study & Analysis in Brazil | Care Labs
- **Meta description:** (not set)
- **H1:** Power System Study and Analysis
- **Eyebrow:** Get Your Power System Analysis Report Now
- **Cities:** São Paulo, Rio de Janeiro, Brasília, Salvador
- **Standards:** ETAP (tool reference)
- **Body:** See [br-content-audit.md §2.4](br-content-audit.md).
- **FAQs:** None

## BR.5 — Power Quality Analysis
- **URL:** https://www.carelabz.com/br/power-quality-analysis/
- **Meta title:** Power Quality Analysis in Brazil | Carelabs Services
- **Meta description:** (not set)
- **H1:** Power Quality Analysis
- **Cities:** São Paulo, Rio de Janeiro, Brasília, Salvador
- **Standards:** none mentioned on WP
- **Body:** See [br-content-audit.md §2.3](br-content-audit.md).
- **FAQs:** None

---

# COLOMBIA (CO)

## CO.1 — Arc Flash Study
- **URL:** https://www.carelabz.com/co/arc-flash-study/
- **Meta title:** Arc Flash Study Services in Colombia | Care Labs
- **Meta description:** (not set)
- **H1:** Arc Flash Study
- **Eyebrow:** Get Your Arc Flash Study Report Now
- **Hero:** "CareLabs is an economical supplier of electrical arc flash analysis, investigation, and certification services for businesses of all types. Arc flash risks, employee training, paperwork, and PPE (Personal Protective Equipment) requirements will be assessed by skilled specialists to verify that your electrical safety program is up-to-date, compliant, and comprehensive."

Body sections (verbatim):

**Overview:** "CareLabs can discover arc flash risks early on and respond appropriately to mitigate the impact of harmonic distortions to ensure the equipment's safety. ETAP (Electrical Transient Analysis Program) software is utilized to analyze and investigate Arc flashes. The quantity of light and heat produced by an arc fault is called an arc flash. This occurs when current flows between conductors via an air gap. The arc flash ionizes the air and emits a considerable amount of light and heat (approximately 35,000 degrees Fahrenheit). Arc flash analysis is the process of investigating and analysing the electrical installations of a facility in order to assess the incident energy available for each piece of electrical equipment. By creating safety criteria for competent electricians working on equipment and circuits, arc flash studies encourage safe working conditions. Included also are revised electrical one-line schematics and equipment locations, and a short circuit and coordination analysis."

**Arc Flash Research Objectives:**
- Determine the extent of damage produced by the incident energy emitted during an arc flash fault.
- Modifying the settings of protective equipment to restrict exposure to incident energy
- Provide safety recommendations regarding arc flash risks.
- Follow the specific rules and laws of your country.
- Determine the type of PPE worn on the job.

**Adverse Consequences of Arc Flash:**
- Arcs result in severe burns to the skin, eyes, and face.
- The inhalation of gases and hot particles can cause severe burns to the throat and lungs.
- Flying debris and loose parts cause injury.

**Importance:** "Arc flash studies are essential for lowering risks, boosting electrical employees' safety, and the general safety of the business. Arc flash studies contribute to the identification of electrical hazard levels and the installation of suitable safety measures to limit the risk of burns and accidents. All utilities, manufacturing, industrial, and commercial businesses that use electrical disconnects, motor control, panel boards, and switchboards must do arc flash analysis."

**Benefits:**
- Enhanced human and mechanical safety
- Decreased medical and legal expenses
- Compliance with regulatory safety standards
- Reduced violations of norms and penalties

**Procedures for Arc Flash Analysis:**
- Data collection
- Conducting field inspection
- Conception of a system
- Analysis of arc flashes

**Work Method Steps (11):**
- Data collection
- ETAP modelling of a power system
- Short-circuit examination
- Coordination of overcurrent protection devices
- An investigation concerning arc flashes
- Examination for arc flashes
- Keeping a ledger
- Methods to reduce the possibility of an arc flash
- Full-size one-line diagrams
- Installation of arc flash markings
- The finished report

**Advantages of CareLabs Services:**
- Create more secure electrical systems that adhere to regulations.
- Integrated modules for comprehensive short circuit, overcurrent coordination, device assessment, and arc flash evaluation are combined with protective devices and bus ratings.
- Creating a more secure workplace
- Simple alternative suggestion for optimal design
- Increased safety margins using user-defined arc fault tolerances
- Our computer-aided analysis will save you time by creating arc flash labels automatically.
- Reduce productivity losses and maintenance costs.

**Service Coverage:** "Crew members are strategically situated throughout CareLabs to ensure that our professionals are close by in case of a regular or urgent situation. CareLabs has rapidly established itself as an **ISO 9001:2008**-accredited business with a clientele that has supplied outstanding feedback. In addition to **Bogotá, Medellín, Cali, and Barranquilla**, we provide arc flash study and analysis services in all major cities."

- **Cities:** Bogotá, Medellín, Cali, Barranquilla
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None
- **Images:** lazy-loaded SVG placeholders (alt text: `arc-flash-blog-2`…`arc-flash-blog-6`)

## CO.2 — Harmonic Study & Analysis
- **URL:** https://www.carelabz.com/co/harmonic-study-and-analysis/
- **Meta title:** Harmonic Study and Analysis in Colombia | Care Labs
- **Meta description:** (not set)
- **H1:** Harmonic Study and Analysis
- **Eyebrow:** Get Your Harmonic Study Report Now
- **Hero:** "CareLabs offers electrical installation services, including electrical safety inspections, testing, calibration, and certification, in addition to a comprehensive study and analysis of harmonics."

**Overview paragraph:** "Experts will review harmonic hazards, training materials, documentation, and personal protective equipment (PPE) to ensure that your electrical safety program is up-to-date, compliant, and exhaustive. CareLabs is able to identify harmonics early on and take the necessary precautions to reduce their impact, thereby ensuring the security of the apparatus." Plus technical detail: 415-volt systems — 5% total / 4% odd / 2% even harmonic limits.

**Effects of Harmonic Distortion (12):**
Responsible for both current circulation and high voltage · Due to significant voltage distortion, equipment failure and devastation · Decreased component lifetime and increased component failure from high internal energy · Branch circuit breakers activate when malfunction occurs · Measurement flaw · Electrical and distribution network fires and eruptions · Generator failure · Reduction in system power factor · Expensive installation and utility fees · Reduced productivity · Passivity and needless driving · Utilization of larger motors.

**Benefits (5):** Safeguards against current/voltage harmonics · Frequency variation constraint · Voltage/current imbalance · Power factor near one · Voltage peak/valley control.

**Workflow (10 steps):** See Template Map §Harmonic.

**CareLabs Service Benefits (tiered 25% / 25-75% / upper) + service coverage:** Bogotá, Medellín, Cali, Barranquilla.

- **Cities:** Bogotá, Medellín, Cali, Barranquilla
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## CO.3 — Motor Start Analysis
- **URL:** https://www.carelabz.com/co/motor-start-analysis/
- **Meta title:** Motor Start Analysis Services Colombia | Care Labs
- **Meta description:** (not set)
- **H1:** Motor Start Analysis
- **Hero:** "Businesses in Colombia may benefit from CareLabs' one-of-a-kind Motor start research and analysis solution. The primary objective of our motor start analysis service is to evaluate the unforeseen effects of starting a large motor."

**Opening paragraph:** "Before turning on an electric motor, it is vital to check for several additional indicators of a faulty power supply, such as nuisance tripping, excessive nominal currents, and flickering or diminishing light, in addition to the line voltage."

**Analysis Methods (4 bullets):** Load flow from observed starting impedance · Voltage drop / short-circuit methods · Dynamic model with transient stability · Transient stability simulations when no dynamic model.

**"Colombia Should Examine Motor Starts":** "Both the scale of electric motors and their utilization in contemporary industrial systems are expanding dramatically. Starting a large motor connected to a line may disrupt the electric motor, locally linked loads, and electrically distant vehicles. When initiating an electric motor, the terminal voltage should be at or greater than 80% of the rated voltage. Because the square of the terminal voltage of a motor is directly proportional to the torque, voltage difference influences the load torque of the motor. If the voltage decrease is significant, machines that are already in motion may reach their breaking torque and slow down or stop. Voltage fluctuations have an effect on a variety of objects, including illumination loads, sensitive control systems, and electrical equipment."

**When Analysis is Needed (5 bullets, repeated twice):**
- Prior to or during the acquisition of a large power train
- Supply transformer trip: motor rating > 30% of base KVA without generator
- Generator-only supply: motor rating > 10-15% of generator kVA → generator replacement
- Simultaneous industrial motor starts
- Small power systems with voltage-drop risk

**Benefits paragraph + service coverage:** Bogotá, Medellín, Cali, Barranquilla.

- **Cities:** Bogotá, Medellín, Cali, Barranquilla
- **Standards:** none on WP
- **FAQs:** None

## CO.4 — Power System Study & Analysis
- **URL:** https://www.carelabz.com/co/power-system-study-and-analysis/
- **Meta title:** Power System Study & Analysis Colombia | Care Labs
- **Meta description:** (not set)
- **H1:** Power System Study and Analysis
- **Eyebrow:** Get Your Power System Analysis Report Now
- **Hero:** "CareLabs provides a variety of electrical installation services, such as electrical safety inspections, simulations of electrical system designs, power quality studies, and studies and analyses of power systems."

**Components list (9):** Breaker circuit · Coordination of security measures · Carrying a burden · Dynamic and instantaneous assessment · Arc Flash Evaluation · Efficiency of Force · Studying harmonics · Launching the automobile · Earthing studies.

**Load Flow / Short-Circuit / Transient / Protection Coordination paragraphs** — identical to template.

**Procedure (11 steps) + Components (7 bullets) — identical to template.**

**Service coverage:** "Bogotá, Medellín, Cali, and Barranquilla."

- **Cities:** Bogotá, Medellín, Cali, Barranquilla
- **Standards:** ETAP (tool reference)
- **FAQs:** None

## CO.5 — Power Quality Analysis
- **URL:** https://www.carelabz.com/co/power-quality-analysis/
- **Meta title:** Power Quality Analysis Services Colombia | Care Labs
- **Meta description:** (not set)
- **H1:** Power Quality Analysis
- **Hero:** "CareLabs evaluates the condition of electricity for Colombian enterprises. Our mission is to safeguard your electrical appliances, electrical installations, and electrical equipment from problems caused by erratic power supplies."

**⚠ Source bug:** Section titled "Peru Must Investigate Power Quality" appears in the flow before the correct "Colombia Must Investigate Power Quality" section — editor missed that country-name swap when forking.

**Purpose list (12), Power Quality Issues (frequency / voltage disruptions / voltage distortion), and What's Included in Analysis (6)** — all identical to template.

**Closing service coverage:** "Bogotá, Medellín, Cali, and Barranquilla del Mar" — note the anomalous "del Mar" suffix which belongs to the Chilean city "Viña del Mar" — another source bug where CO copy reused CL text.

- **Cities:** Bogotá, Medellín, Cali, Barranquilla (source has typo "Barranquilla del Mar")
- **Standards:** none mentioned
- **FAQs:** None

---

# CHILE (CL)

## CL.1 — Arc Flash Study
- **URL:** https://www.carelabz.com/cl/arc-flash-study/
- **Meta title:** Arc Flash Study Services in Chile | Care Labs
- **Meta description:** (not set)
- **H1:** Arc Flash Study
- **Eyebrow:** Get Your Arc Flash Study Report Now
- **Hero:** "CareLabs is an economical provider of electrical arc flash analysis, investigation, and certification services for all enterprises. Qualified professionals will evaluate arc flash hazards, staff training, documentation requirements, and PPE (Personal Protective Equipment) standards to ensure that your electrical safety program is current, compliant, and comprehensive."

**Body:** All sections identical to Template Map §Arc Flash Study.

- **Cities:** Santiago, Valparaíso, Concepción, Viña del Mar
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## CL.2 — Harmonic Study & Analysis
- **URL:** https://www.carelabz.com/cl/harmonic-study-and-analysis/
- **Meta title:** Harmonic Study and Analysis in Chile | Care Labs
- **Meta description:** (not set)
- **H1:** Harmonic Study and Analysis
- **Eyebrow:** Get Your Harmonic Study Report Now
- **Hero:** "CareLabs offers electrical installation services, including electrical safety inspections, testing, calibration, and certification, in addition to a comprehensive study and analysis of harmonics."
- **Body:** All sections identical to Template Map §Harmonic.
- **Cities:** Santiago, Valparaíso, Concepción, Viña del Mar
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## CL.3 — Motor Start Analysis
- **URL:** https://www.carelabz.com/cl/motor-start-analysis/
- **Meta title:** Motor Start Analysis Services Chile | Care Labs
- **Meta description:** (not set)
- **H1:** Motor Start Analysis
- **Hero:** "Businesses in Chile may benefit from CareLabs' one-of-a-kind Motor start research and analysis solution. The primary objective of our motor start analysis service is to evaluate the unforeseen effects of starting a large motor."
- **Body:** Identical to template, section repeated twice (same bug).
- **Cities:** Santiago, Valparaíso, Concepción, Viña del Mar
- **Standards:** none on WP
- **FAQs:** None

## CL.4 — Power System Study & Analysis
- **URL:** https://www.carelabz.com/cl/power-system-study-and-analysis/
- **Meta title:** Power System Study & Analysis Chile | Care Labs
- **Meta description:** (not set)
- **H1:** Power System Study and Analysis
- **Eyebrow:** Get Your Power System Analysis Report Now
- **Body:** Identical to template.
- **Cities:** Santiago, Valparaíso, Concepción, Viña del Mar
- **Standards:** ETAP
- **FAQs:** None

## CL.5 — Power Quality Analysis
- **URL:** https://www.carelabz.com/cl/power-quality-analysis/
- **Meta title:** Power Quality Analysis Services Chile | Care Labs
- **Meta description:** (not set)
- **H1:** Power Quality Analysis
- **Hero:** "CareLabs evaluates the condition of electricity for Chilean enterprises. Our mission is to safeguard your electrical appliances, electrical installations, and electrical equipment from problems caused by erratic power supplies."
- **Body:** Identical to template.
- **Closing:** "Santiago, Valparaíso, Concepción, and Viña del Mar are among the major locations where we monitor electricity quality."
- **Cities:** Santiago, Valparaíso, Concepción, Viña del Mar
- **Standards:** none on WP
- **FAQs:** None
- **⚠ Strapi discrepancy:** Our [countries-config.ts](../src/lib/countries-config.ts) lists the CL address as "Santiago" but uses "Antofagasta" in some contexts. WP source authoritatively uses **Viña del Mar** as the 4th city, not Antofagasta. Recommend aligning Strapi + countries-config to the WP city list.

---

# ARGENTINA (AR)

## AR.1 — Arc Flash Study
- **URL:** https://www.carelabz.com/ar/arc-flash-study/
- **Meta title:** Arc Flash Study and Analysis Services Argentina | Care Labs
- **Meta description:** (not set)
- **H1:** Arc Flash Study
- **Eyebrow:** Arc Flash Study (self-duplicating on this one; source uses H1 text again as eyebrow)
- **Hero:** "For companies of all sizes, CareLabs is a cost-effective source of electrical arc flash analysis, investigation, and certification services. To confirm that your electrical safety program is current, compliant, and thorough, qualified professionals will evaluate arc flash threats, staff training, documentation needs, and PPE (Personal Protective Equipment) standards."
- **Body:** Identical to template.
- **Cities:** Buenos Aires, Córdoba, Rosario, Mendoza
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## AR.2 — Harmonic Study & Analysis
- **URL:** https://www.carelabz.com/ar/harmonic-study-and-analysis/
- **Meta title:** Harmonic Study and Analysis Services Argentina | Care Labs
- **Meta description:** (not set)
- **H1:** Harmonic Study and Analysis
- **Eyebrow:** Get Your Harmonic Study Report Now
- **Hero:** "In addition to a thorough study and analysis of harmonics, CareLabs provides electrical installation services such electrical safety inspections, testing, calibration, and certification."
- **Body:** Identical to template.
- **Cities:** Buenos Aires, Córdoba, Rosario, Mendoza
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## AR.3 — Motor Start Analysis
- **URL:** https://www.carelabz.com/ar/motor-start-analysis/
- **Meta title:** Motor Start Analysis Services in Argentina | Care Labs
- **Meta description:** (not set)
- **H1:** Motor Start Analysis
- **Eyebrow:** "Argentina-based businesses may benefit from CareLabs' unique Motor start research and analysis solution."
- **Body:** Identical to template (section repeated twice — same bug).
- **Cities:** Buenos Aires, Córdoba, Rosario, Mendoza
- **Standards:** none on WP
- **FAQs:** None

## AR.4 — Power System Study & Analysis
- **URL:** https://www.carelabz.com/ar/power-system-study-and-analysis/
- **Meta title:** Power System Study & Analysis Argentina | Care Labs
- **Meta description:** (not set)
- **H1:** Power System Study and Analysis
- **Eyebrow:** Get Your Power System Analysis Report Now
- **Body:** Identical to template.
- **Cities:** Buenos Aires, Córdoba, Rosario, Mendoza
- **Standards:** ETAP
- **FAQs:** None

## AR.5 — Power Quality Analysis
- **URL:** https://www.carelabz.com/ar/power-quality-analysis/
- **Meta title:** Power Quality Analysis Services Argentina | Care Labs
- **Meta description:** (not set)
- **H1:** Power Quality Analysis
- **Hero:** "CareLabs evaluates the electricity quality for businesses in Argentina. Our goal is to protect your appliances, electrical installations, and electrical equipment from any problems brought on by unstable power supplies."
- **Body:** Identical to template.
- **Closing:** "Buenos Aires, Córdoba, Rosario, and Mendoza are just a few of the main cities…"
- **Cities:** Buenos Aires, Córdoba, Rosario, Mendoza
- **Standards:** none on WP
- **FAQs:** None

---

# PERU (PE)

## PE.1 — Arc Flash Study
- **URL:** https://www.carelabz.com/pe/arc-flash-study/
- **Meta title:** Arc Flash Study and Analysis Services Peru | Care Labs
- **Meta description:** (not set)
- **H1:** Arc Flash Study
- **Eyebrow:** Get Your Arc Flash Study Report Now
- **Hero:** "CareLabs is an economical supplier of electrical arc flash analysis, investigation, and certification services for businesses of all type."
- **Body:** Identical to template (verbatim match to BR).
- **Cities:** Lima, Arequipa, Trujillo, Chiclayo
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## PE.2 — Harmonic Study & Analysis
- **URL:** https://www.carelabz.com/pe/harmonic-study-and-analysis/
- **Meta title:** Harmonic Study and Analysis Services Peru | Care Labs
- **Meta description:** (not set)
- **H1:** Harmonic Study and Analysis
- **Eyebrow:** Get Your Harmonic Study Report Now
- **Hero:** "CareLabs offers electrical installation services such as electrical safety inspections, testing, calibration, and certification, in addition to a comprehensive examination and analysis of harmonics."
- **Body:** Identical to template.
- **Cities:** Lima, Arequipa, Trujillo, Chiclayo
- **Standards:** ISO 9001:2008 · ETAP
- **FAQs:** None

## PE.3 — Motor Start Analysis
- **URL:** https://www.carelabz.com/pe/motor-start-analysis/
- **Meta title:** Motor Start Analysis Services in Peru | Care Labs
- **Meta description:** (not set)
- **H1:** Motor Start Analysis
- **Eyebrow:** Get Your Motor Start Analysis Report Now
- **Hero:** "CareLabs offers organizations in Peru a specialized Motor start study and analysis solution. The major objective of our motor start analysis service is to assess the atypical effects of starting a big motor."
- **Body:** Identical to template (section repeated twice).
- **Cities:** Lima, Arequipa, Trujillo, Chiclayo
- **Standards:** none on WP
- **FAQs:** None

## PE.4 — Power System Study & Analysis
- **URL:** https://www.carelabz.com/pe/power-system-study-and-analysis/
- **Meta title:** Power System Study and Analysis Services Peru | Care Labs
- **Meta description:** (not set)
- **H1:** Power System Study and Analysis
- **Eyebrow:** Get Your Power System Analysis Report Now
- **Body:** Identical to template.
- **Cities:** Lima, Arequipa, Trujillo, Chiclayo
- **Standards:** ETAP
- **FAQs:** None

## PE.5 — Power Quality Analysis
- **URL:** https://www.carelabz.com/pe/power-quality-analysis/
- **Meta title:** Power Quality Analysis Services in Peru | Care Labs
- **Meta description:** (not set)
- **H1:** Power Quality Analysis
- **Hero:** "CareLabs evaluates the condition of electricity for Peruvian enterprises. Our mission is to safeguard your electrical appliances, electrical installations, and electrical equipment from problems caused by erratic power supplies."
- **Body:** Identical to template.
- **Closing:** "We offer power quality analysis in all major cities, including Lima, Arequipa, Trujillo, and Chiclayo."
- **Cities:** Lima, Arequipa, Trujillo, Chiclayo
- **Standards:** none on WP
- **FAQs:** None

---

# Appendix A — What was NOT inherited from WordPress

Our Strapi ServicePage entries authored during migration now include content that does NOT exist on WP source:

| Field | WP source | Strapi (authored) |
|---|---|---|
| metaDescription | empty | 150-160 char SEO description |
| FAQ Q&A | none | 5 AEO-structured FAQs per service |
| Country-specific standards | only ISO 9001:2008 | primary + secondary std per country (RETIE/NR-10/NCh/AEA/RM 111) |
| Trust badges | implicit | explicit 4-badge array |
| processSteps (numbered) | flat bullet list | structured {number, title, description} |
| features[] with titles + descriptions | flat bullets | 4 structured features per service |
| safetyBody + safetyBullets | mixed in flow | discrete section |
| reportsBody + reportsBullets | flat bullets | discrete section |
| ctaBannerHeading / Body / Primary / Secondary | single CTA link | full CTA block |
| category tagging | none | "Arc Flash Study" / "Power Quality" / etc. |

# Appendix B — Variable lookup per country (for future content ops)

| cc | Country | Adjective | Primary std (Strapi) | Secondary std | Authority | WP cities |
|---|---|---|---|---|---|---|
| br | Brazil | Brazilian | NR-10 | ABNT NBR 5410 | Ministério do Trabalho | São Paulo, Rio de Janeiro, Brasília, Salvador |
| co | Colombia | Colombian | RETIE | NTC 2050 | Min. de Minas y Energía | Bogotá, Medellín, Cali, Barranquilla |
| cl | Chile | Chilean | NCh Elec. 4/2003 | NSEG 5 En. 71 | SEC | Santiago, Valparaíso, Concepción, Viña del Mar |
| ar | Argentina | Argentine | AEA 90364 | IRAM 2281 | ENRE | Buenos Aires, Córdoba, Rosario, Mendoza |
| pe | Peru | Peruvian | RM 111-2013-MEM | CNE | OSINERGMIN | Lima, Arequipa, Trujillo, Chiclayo |

# Appendix C — Source bugs for editorial cleanup (WP-side, not our site)

1. **CO / power-quality page** — section heading mis-labeled "Peru Must Investigate Power Quality" (should be Colombia)
2. **CO / power-quality closing** — city list includes "Barranquilla del Mar" (should be plain Barranquilla; "del Mar" suffix belongs to Chile's Viña del Mar)
3. **All 5 countries / motor-start page** — "When Should a Motor Start Analysis Be Performed?" section appears twice with identical content
4. All service pages — no meta descriptions, no author, no dates, no FAQs, no country-specific standards beyond ISO 9001:2008

None of these bugs affect our Carelabs Vercel site (Strapi content has been authored independently and corrected). They only matter if anyone is still reading www.carelabz.com directly.

---

*End of audit. Source: www.carelabz.com via WebFetch, 2026-04-25.*
