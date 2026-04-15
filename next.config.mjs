/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rational-cheese-8e8c4f80ea.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "**.strapiapp.com",
      },
    ],
  },
  async redirects() {
    /** Helper: creates both trailing-slash and non-trailing-slash source variants */
    function pair(source, destination) {
      const clean = source.replace(/\/+$/, "");
      return [
        { source: clean, destination, permanent: true },
        { source: clean + "/", destination, permanent: true },
      ];
    }

    return [
      /* ============================================================ */
      /*  US — Core pages                                             */
      /* ============================================================ */
      ...pair("/us/about-us", "/us/about/"),
      ...pair("/us/contact-us", "/us/contact/"),
      ...pair("/us/case-study", "/us/case-studies/"),
      ...pair("/us/privacy-policy", "/privacy/"),
      ...pair("/us/terms-and-conditions", "/terms/"),
      ...pair("/company/privacy-policy", "/privacy/"),
      ...pair("/company/terms-and-conditions", "/terms/"),

      /* ============================================================ */
      /*  US — Service pages                                          */
      /* ============================================================ */
      ...pair("/us/service/arc-flash-study-in-usa", "/us/services/study-analysis/arc-flash-study/"),
      ...pair("/us/service/short-circuit-analysis", "/us/services/study-analysis/short-circuit-analysis/"),
      ...pair("/us/service/load-flow-analysis-us", "/us/services/study-analysis/load-flow-analysis/"),
      ...pair("/us/service/relay-coordination-study-in-usa", "/us/services/study-analysis/relay-coordination-study/"),
      ...pair("/us/harmonic-study-and-analysis-in-usa", "/us/services/study-analysis/harmonic-study/"),
      ...pair("/us/power-quality-analysis-in-usa", "/us/services/study-analysis/power-quality-analysis/"),
      ...pair("/us/motor-start-analysis-in-usa", "/us/services/study-analysis/motor-start-analysis/"),
      ...pair("/us/power-system-study-and-analysis-in-usa", "/us/services/study-analysis/power-system-study/"),
      ...pair("/us/electrical-safety-inspection-in-usa", "/us/services/inspection/electrical-safety-inspection/"),

      /* ============================================================ */
      /*  US — Blog posts                                             */
      /* ============================================================ */
      ...pair("/us/step-by-step-guide-to-perform-arc-flash-analysis-in-the-us", "/us/blog/step-by-step-guide-to-perform-arc-flash-analysis-in-the-us/"),
      ...pair("/us/working-principles-of-power-quality-analysis-in-the-us", "/us/blog/working-principles-of-power-quality-analysis-in-the-us/"),
      ...pair("/us/harmonic-analysis-in-power-system-in-the-us", "/us/blog/harmonic-analysis-in-power-system-in-the-us/"),
      ...pair("/us/arc-flash-at-turkey-point-2017", "/us/blog/arc-flash-at-turkey-point-2017/"),
      ...pair("/us/priest-rapids-dam-arc-flash-explosion-2014", "/us/blog/priest-rapids-dam-arc-flash-explosion-2014/"),
      ...pair("/us/checklist-for-electrical-safety-audit-in-the-usa", "/us/blog/checklist-for-electrical-safety-audit-in-the-usa/"),
      ...pair("/us/mgm-grand-hotel-fire-1980", "/us/blog/mgm-grand-hotel-fire-1980/"),
      ...pair("/us/test-and-verify-efficiency-of-electrical-motor-as-per-national-international-standards", "/us/blog/test-and-verify-efficiency-of-electrical-motor/"),
      ...pair("/us/resolving-safety-issues-with-arc-flash-and-lockout-tagout-services-at-a-leading-medical-company", "/us/blog/resolving-safety-issues-arc-flash-lockout-tagout/"),
      ...pair("/us/which-of-these-facts-about-arc-flashes-are-true", "/us/blog/which-of-these-facts-about-arc-flashes-are-true/"),
      ...pair("/us/the-importance-of-relay-coordination-in-power-system", "/us/blog/the-importance-of-relay-coordination-in-power-system/"),
      ...pair("/us/upgrading-your-power-system-dont-ignore-the-short-circuit-analysis", "/us/blog/upgrading-your-power-system-short-circuit-analysis/"),
      ...pair("/us/what-are-the-key-insights-obtained-from-load-flow-analysis", "/us/blog/key-insights-from-load-flow-analysis/"),
      ...pair("/us/improving-reliability-through-electrical-safety-audit-at-a-retail-company", "/us/blog/improving-reliability-electrical-safety-audit-retail/"),
      ...pair("/us/commercial-electrical-safety-inspection-checklist-for-the-united-states", "/us/blog/commercial-electrical-safety-inspection-checklist-usa/"),
      ...pair("/us/prioritizing-a-safe-work-environment-at-a-multinational-technology-company", "/us/blog/safe-work-environment-multinational-technology-company/"),
      ...pair("/us/energy-conservation-by-auditing-power-quality", "/us/blog/energy-conservation-by-auditing-power-quality/"),
      ...pair("/us/three-mile-island-blast-1979", "/us/blog/three-mile-island-blast-1979/"),
      ...pair("/us/how-to-do-an-electrical-switchgear-risk-assessment-in-usa", "/us/blog/electrical-switchgear-risk-assessment-usa/"),
      ...pair("/us/arc-flash-study-a-grandeur-or-mandate", "/us/blog/arc-flash-study-a-grandeur-or-mandate/"),
      ...pair("/us/electrical-condition-installation-report-by-third-party-company-in-the-usa", "/us/blog/electrical-condition-installation-report-usa/"),
      ...pair("/us/why-is-harmonic-study-and-analysis-important-for-companies-in-the-united-states", "/us/blog/why-harmonic-study-analysis-important-usa/"),
      ...pair("/us/need-or-necessity-electrical-switchgear-risk-assessment-in-the-usa", "/us/blog/need-electrical-switchgear-risk-assessment-usa/"),
      ...pair("/us/importance-of-electrical-safety-inspection-in-usa", "/us/blog/importance-of-electrical-safety-inspection-usa/"),
      ...pair("/us/importance-of-electrical-safety-audit-for-companies-in-the-usa", "/us/blog/importance-of-electrical-safety-audit-usa/"),
      ...pair("/us/importance-of-electrical-installation-condition-report-ecir-in-the-us", "/us/blog/importance-electrical-installation-condition-report-ecir/"),
      ...pair("/us/importance-of-arc-flash-hazard-analysis-and-mitigation-in-the-united-states", "/us/blog/importance-arc-flash-hazard-analysis-mitigation-usa/"),
      ...pair("/us/how-to-perform-power-system-study-and-analysis-for-load-flow-short-circuit-and-relay-coordination-for-a-company-in-the-us", "/us/blog/power-system-study-load-flow-short-circuit-relay-coordination/"),
      ...pair("/us/how-to-audit-electric-motor-efficiency-and-reliability-for-commercial-use", "/us/blog/audit-electric-motor-efficiency-reliability/"),
      ...pair("/us/guide-to-perform-power-quality-analysis-in-the-united-states", "/us/blog/guide-power-quality-analysis-united-states/"),
    ];
  },
};

export default nextConfig;
