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
      {
        protocol: "https",
        hostname: "images.unsplash.com",
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
      ...pair("/us/importance-of-electrical-safety-inspection-in-usa", "/us/blog/upgrading-your-power-system-short-circuit-analysis/"),
      ...pair("/us/blog/importance-of-electrical-safety-inspection-usa", "/us/blog/upgrading-your-power-system-short-circuit-analysis/"),
      ...pair("/us/importance-of-electrical-safety-audit-for-companies-in-the-usa", "/us/blog/importance-of-electrical-safety-audit-usa/"),
      ...pair("/us/importance-of-electrical-installation-condition-report-ecir-in-the-us", "/us/blog/importance-electrical-installation-condition-report-ecir/"),
      ...pair("/us/importance-of-arc-flash-hazard-analysis-and-mitigation-in-the-united-states", "/us/blog/which-of-these-facts-about-arc-flashes-are-true/"),
      ...pair("/us/blog/importance-arc-flash-hazard-analysis-mitigation-usa", "/us/blog/which-of-these-facts-about-arc-flashes-are-true/"),
      ...pair("/us/how-to-perform-power-system-study-and-analysis-for-load-flow-short-circuit-and-relay-coordination-for-a-company-in-the-us", "/us/blog/power-system-study-load-flow-short-circuit-relay-coordination/"),
      ...pair("/us/how-to-audit-electric-motor-efficiency-and-reliability-for-commercial-use", "/us/blog/audit-electric-motor-efficiency-reliability/"),
      ...pair("/us/guide-to-perform-power-quality-analysis-in-the-united-states", "/us/blog/guide-power-quality-analysis-united-states/"),

      /* ============================================================ */
      /*  CA — Legacy WP cruft + typo redirects                       */
      /* ============================================================ */
      ...pair("/ca/services-arch-flash-analysis", "/ca/services/arc-flash-study/"),
      ...pair("/ca/services-old", "/ca/service/"),
      ...pair("/ca/home", "/ca/"),

      /* ============================================================ */
      /*  LATAM + UK — WP junk/legacy redirects                        */
      /* ============================================================ */
      ...pair("/mx/404-page", "/mx/"),
      ...pair("/mx/home", "/mx/"),
      ...pair("/mx/services-old", "/mx/service/"),
      ...pair("/br/404-page", "/br/"),
      ...pair("/co/404-page", "/co/"),
      ...pair("/cl/404-page", "/cl/"),
      ...pair("/ar/404-page", "/ar/"),
      ...pair("/pe/404-page", "/pe/"),
      ...pair("/uk/home-demo", "/uk/"),
      ...pair("/uk/ss", "/uk/"),
      ...pair("/uk/404-page", "/uk/"),
      // UK services index is at /our-services/, not /services/
      ...pair("/uk/services", "/uk/our-services/"),
      ...pair("/uk/service", "/uk/our-services/"),

      /* ============================================================ */
      /*  NZ — WP legacy 'carelabz-com-nz-*' slugs cleaned up          */
      /*  Old WP URL preserved via 301 to new clean URL                */
      /* ============================================================ */
      ...pair(
        "/nz/carelabz-com-nz-arc-flash-study-and-analysis-in-new-zealand",
        "/nz/arc-flash-study-in-new-zealand/"
      ),
      ...pair(
        "/nz/carelabz-com-nz-harmonic-study-and-analysis-in-new-zealand",
        "/nz/harmonic-study-in-new-zealand/"
      ),
      ...pair(
        "/nz/carelabz-com-nz-power-system-study-and-analysis-in-new-zealand",
        "/nz/power-system-study-in-new-zealand/"
      ),
      ...pair(
        "/nz/carelabz-com-nz-power-quality-analysis-in-new-zealand",
        "/nz/power-quality-analysis-in-new-zealand/"
      ),

      /* ============================================================ */
      /*  DE — nested-service country not in the flat batch.          */
      /*  WP serves /de/blog/ (we use /de/blogs/), /de/case-study/    */
      /*  (we don't have one), /de/service/:slug/ (we use /services/).*/
      /* ============================================================ */
      ...pair("/de/blog", "/de/blogs/"),
      ...pair("/de/case-study", "/de/"),
      { source: "/de/service/:slug", destination: "/de/services/:slug/", permanent: true },
      { source: "/de/service/:slug/", destination: "/de/services/:slug/", permanent: true },

      /* ============================================================ */
      /*  MY + VN — WP uses "-in-malaysia" / "-in-vietnam" suffix AND */
      /*  swaps "arc-flash-analysis" where our slug is "arc-flash-    */
      /*  study". Must come BEFORE the generic /xx/service/:slug/     */
      /*  rule so specific mappings win.                               */
      /* ============================================================ */
      ...pair("/my/arc-flash-study-in-malaysia", "/my/arc-flash-study/"),
      ...pair("/my/service/arc-flash-analysis-in-malaysia", "/my/arc-flash-study/"),
      ...pair("/my/service/short-circuit-analysis-in-malaysia", "/my/short-circuit-analysis/"),
      ...pair("/my/service/load-flow-analysis-in-malaysia", "/my/load-flow-analysis/"),
      ...pair("/my/service/relay-coordination-study-in-malaysia", "/my/relay-coordination-study/"),
      ...pair("/vn/arc-flash-study-in-vietnam", "/vn/arc-flash-study/"),
      ...pair("/vn/service/arc-flash-analysis-in-vietnam", "/vn/arc-flash-study/"),
      ...pair("/vn/service/short-circuit-analysis-in-vietnam", "/vn/short-circuit-analysis/"),
      ...pair("/vn/service/load-flow-analysis-in-vietnam", "/vn/load-flow-analysis/"),
      ...pair("/vn/service/relay-coordination-study-in-vietnam", "/vn/relay-coordination-study/"),

      /* ============================================================ */
      /*  Flat-service countries — WP serves duplicate URLs at         */
      /*  /xx/services/slug/ and /xx/services/ that don't map to our  */
      /*  flat routes. Redirect them to the canonical flat location.  */
      /* ============================================================ */
      // Note: se/no/dk/fi/uk/ie removed from the generic /xx/case-study → /xx/
      // redirect below because they now have real /case-studies/ placeholder
      // pages. Those 4 country-specific case-study redirects are handled
      // separately below the main list.
      ...[
        "at", "be", "ch", "nl", "au",
        "es", "pt", "gr", "fr", "ru", "pl", "hu", "cz", "ro", "sk", "ua",
        "cn", "jp", "kr", "hk", "tw", "my", "sg", "th", "vn", "id", "ph",
        "nz", "sa", "tr", "za", "eg", "it",
      ].flatMap((cc) => [
        // /xx/services/ → /xx/our-services/ (for countries using our-services)
        ...pair(`/${cc}/services`, `/${cc}/our-services/`),
        // /xx/services/SLUG/ → /xx/SLUG/ (flat redirect)
        { source: `/${cc}/services/:slug`, destination: `/${cc}/:slug/`, permanent: true },
        { source: `/${cc}/services/:slug/`, destination: `/${cc}/:slug/`, permanent: true },
        // Some WP installs use singular /service/ — same flat target
        { source: `/${cc}/service/:slug`, destination: `/${cc}/:slug/`, permanent: true },
        { source: `/${cc}/service/:slug/`, destination: `/${cc}/:slug/`, permanent: true },
        // /xx/case-study/ → /xx/ (countries without case-study page)
        ...pair(`/${cc}/case-study`, `/${cc}/`),
        // /xx/home-2/ → /xx/ (WP junk homepage duplicates)
        ...pair(`/${cc}/home-2`, `/${cc}/`),
      ]),

      /* ============================================================ */
      /*  Blog-index slug variants across countries                    */
      /* ============================================================ */
      // MY, VN, TH, SG, ID, PH use /our-blogs/ on WP but our index is /blogs/
      ...["my", "vn", "th", "sg", "id", "ph"].flatMap((cc) => pair(`/${cc}/our-blogs`, `/${cc}/blogs/`)),
      // NZ uses /blog/ singular on WP but our index is /blogs/
      ...pair("/nz/blog", "/nz/blogs/"),

      // BR/CO/CL/AR/PE use /services/ plural as their real index, not redirect
      // (handled separately — not in the list above).
      // IN uses /our-services/ and /our-blogs/ — blog index already correct.

      /* ============================================================ */
      /*  NE case-study → case-studies (UK/IE/SE/NO/DK/FI now have    */
      /*  real placeholder pages, so /case-study/ redirects to those) */
      /* ============================================================ */
      ...["uk", "ie", "se", "no", "dk", "fi"].flatMap((cc) => [
        ...pair(`/${cc}/case-study`, `/${cc}/case-studies/`),
      ]),
    ];
  },
};

export default nextConfig;
