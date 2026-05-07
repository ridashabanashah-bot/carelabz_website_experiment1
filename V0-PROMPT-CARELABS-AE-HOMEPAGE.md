# v0 Prompt — Carelabs UAE Homepage

Paste everything below into v0. Also attach the Carelabs logo (PNG) and the brand guidelines PDF.

---

Design a homepage for Carelabs — a power systems engineering, compliance, and risk management company serving the UAE and 50+ countries. This is their UAE regional homepage.

## About the Company

Carelabs engineers smarter, safer, and future-ready electrical solutions. Their core services for the UAE market include: Arc Flash Study & Analysis, Short Circuit Analysis, Load Flow Analysis, Relay Coordination Study, Thermographic Inspection, Circuit Breaker Testing, and Cable Testing. They work with standards like DEWA, IEEE 1584, NFPA 70E, IEC 61482, and IEC 60364.

Their mission: "Redefining power systems with innovation, precision, and sustainability — ensuring businesses operate with efficiency, resilience, and zero compromise."

Their core values: Safety, Innovation, Sustainability / Integrity, Precision, Excellence / Reliable Power, Limitless Possibilities / Smart Solutions, Sustainable Impact / Customer First, Future Focused.

## Brand Identity (strict — must follow exactly)

### Logo
- Text-based wordmark: "care" in blue + "labs" in orange (see attached logo file)
- Font: Ennis Pro (logo only — do not use Ennis Pro anywhere else)
- Logo colors: Blue #2575B6, Orange #F15C30
- Minimum clearspace: 100px on all sides
- Never stretch, distort, rotate, outline, recolor, or add effects to the logo

### Color Palette

**Primary brand colors:**
- Blue: #2575B6 (trust, professionalism, stability)
- Orange: #F15C30 (energy, innovation, engagement)

**Neutrals:**
- Black: #000000
- White: #FFFFFF
- Gray: #9C9B9A
- Light Gray: #F2F2F4

**Extended / functional colors:**
- Dark Blue: #094D76 (accent, contrast)
- Success Green: #027A48
- Light Success Green: #ECFDF3
- Error Red: #B42318
- Light Error Red: #FEEFEF

### Typography
- Ennis Pro is ONLY for the logo — never use it in body text or headings
- For headings and body text, use a clean modern sans-serif (the brand guidelines leave this open for digital — choose something that pairs well with the brand identity)

## Design Requirements

### Navigation
- Sticky navbar with the Carelabs logo on the left
- Three nav items only: About Us, Services (with dropdown), Contact Us
- Contact Us is the primary CTA button in the brand orange

### Homepage Sections (design these in order)

1. **Hero Section**
   - Strong headline about power system engineering and electrical safety in the UAE
   - Subtext about DEWA compliance and their UAE expertise
   - Two CTAs: primary "Get a Quote" (orange) and secondary "Our Services" (outlined or ghost)
   - Consider using the brand blue as the hero background with white text, or a clean white hero with blue/orange accents — surprise me with something striking

2. **Trust / Credentials Bar**
   - Show compliance standards they work with: DEWA, IEEE 1584, NFPA 70E, IEC 61482, IEC 60364
   - Could be a logo bar, badge strip, or subtle ticker — keep it understated and professional

3. **Services Section**
   - Display 6 core services: Arc Flash Study & Analysis, Short Circuit Analysis, Load Flow Analysis, Relay Coordination Study, Thermographic Inspection, Circuit Breaker Testing
   - Each service gets a card or tile with an icon, title, and one-line description
   - Link each to a service detail page

4. **About / Value Proposition Section**
   - Brief brand statement about who Carelabs is and what makes them different
   - Could incorporate their mission or a stat-driven "by the numbers" section
   - Emphasize precision, safety, and UAE expertise

5. **How We Work / Methodology Section**
   - 3-4 step process showing how they engage with clients
   - Steps like: Assessment → Engineering Analysis → Detailed Reporting → Ongoing Support
   - Clean numbered or icon-driven layout

6. **Insights / Blog Preview**
   - Show 3 recent article cards with title, category tag, date, and excerpt
   - "Read All Articles" link at the bottom

7. **FAQ Section**
   - Expandable accordion with 4-5 common questions
   - Questions about arc flash studies, DEWA compliance, timelines, what to expect

8. **CTA Banner**
   - Full-width call to action before the footer
   - Headline like "Ready to ensure compliance?" with a contact button
   - Use brand blue or a dark background to create contrast

9. **Footer**
   - 4-column layout: Logo + description, Services links, Company links (About, Blog, Case Studies, Contact), Contact info (email: info@carelabz.com)
   - Copyright bar at the bottom
   - Keep it clean and minimal

## Design Direction

- This is a B2B engineering firm, not a startup — the design should feel established, precise, and trustworthy
- Use the blue #2575B6 as the dominant brand color throughout, with orange #F15C30 as the accent (CTAs, highlights, hover states)
- Generous whitespace — let the content breathe
- Use the Light Gray #F2F2F4 for alternating section backgrounds
- Dark Blue #094D76 works well for dark sections (hero, CTA banner, footer)
- Icons should be simple line-style (like Lucide or Phosphor)
- No stock photos of handshakes or generic office scenes — use abstract geometric patterns, engineering-inspired graphics, or clean gradients if imagery is needed
- All text should be real copy appropriate for a UAE electrical engineering firm, not lorem ipsum
- Mobile responsive

## Technical Notes

- Use Next.js App Router conventions (this will be implemented in Next.js 14)
- Use Tailwind CSS for all styling
- Use Lucide React for icons
- Components should be modular and reusable
- The design will be connected to a headless CMS (Strapi) so structure content areas to be easily data-driven
