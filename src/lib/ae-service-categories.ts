// AE service category mapping. Source of truth = canonical WP URL list provided by client.
// TODO: migrate this to a Strapi enum field on ServicePage (`category`) once admin access is available.

export type AEServiceCategory =
  | "Testing"
  | "Calibration"
  | "Inspection"
  | "Study & Analysis";

const TESTING = new Set([
  "automatic-transfer-switch-testing-service",
  "capacitor-bank-test",
  "commercial-electrical-test",
  "contact-resistance-test",
  "earth-fault-loop-impedance-test",
  "earth-ground-test",
  "electrical-safety-test",
  "generator-load-bank-test",
  "insulation-resistance-test",
  "lightning-arrester-test",
  "portable-appliance-test",
  "factory-acceptance-test",
  "protective-devices-test",
  "megger-test",
  "live-test",
  "continuity-test",
  "rcd-test-safety",
  "psc-test-pfc-test",
  "switchgear-test",
  "battery-test",
  "protection-relay-test",
  // Existing Strapi slug variants the client URL list maps to
  "automatic-transfer-switch-testing",
  "capacitor-bank-testing",
  "commercial-electrical-testing",
  "contact-resistance-testing-service",
  "continuity-testing",
  "earth-fault-loop-impedence-test",
  "earth-ground-testing-service",
  "electrical-safety-testing",
  "electric-motor-testing",
  "electric-switchgear-testing-services",
  "generator-load-bank-testing",
  "insulation-resistance-test-service",
  "lightning-arrester-testing",
  "lightning-arrester-testing-service",
  "live-testing",
  "portable-appliance-testing-dubai-uae",
  "factory-acceptance-testing-services",
  "fixed-electrical-testing",
  "fixed-wire-testing",
  "leakage-current-measurement",
  "primary-current-injection-test",
  "secondary-current-injection-test",
  "polarity-test-service",
  "ground-fault-testing",
  "mcc-panel-operation-testing",
  "soil-resistivity-test",
  "torque-test",
  "battery-testing-services-dubai-uae",
  "biomedical-equipment-safety-testing-services",
  "cable-testing",
  "circuit-breaker-testing",
  "protection-relay-testing-services",
  "protective-devices-testing-services",
  "residual-current-device-testing-safety",
  "residual-current-device-testing-safety-2",
]);

const CALIBRATION = new Set([
  "temperature-humidity-calibration",
  "bain-marie-calibration",
  "blast-chiller-calibration",
  "blast-freezer-calibration",
  "calibrator-calibration",
  "chiller-calibration",
  "digital-thermometer-calibration",
  "electrical-calibration",
]);

const INSPECTION = new Set([
  "electrical-inspection",
  "3rd-party-inspection-of-electrical-installation",
  "third-party-electrical-certification",
  "electrical-installations-certification",
  "electrical-safety-audit",
  "electrical-switchgear-safety-inspection",
  "commercial-electrical-inspection",
  "gfci-standard-inspection",
  "biomedical-equipment-safety-inspection",
  "building-envelope-thermography-inspection",
  "electrical-installation-inspection-to-procure-ofc",
  "electrical-thermography-inspection-services",
  "thermography-testing-of-electrical-equipment",
  "thermography-test-of-electrical-panels",
  // Strapi-existing variants
  "biomedical-equipment-safety-inspection-services",
  "building-envelope-infrared-thermography-inspection-service",
  "commercial-electrical-inspection-services-dubai-uae",
  "electrical-compliance-inspection",
  "electrical-installations-certification-service",
  "electrical-safety-audit-service",
  "electrical-safety-auditing-inspection-service",
  "electrical-switchgear-safety-inspection-services",
  "electrical-thermography-inspection",
  "gfci-standard-inspection-service",
  "third-party-electrical-inspection-company-uae",
  "third-party-inspection-electrical-installation",
  "energy-auditing-service",
  "electrical-switchgear-risk-assessment-study-hazard-analysis-service",
]);

const STUDY = new Set([
  "unbalanced-load-flow-study-analysis",
  "voltage-drop-study-analysis",
  "electrical-switchgear-risk-assessment",
  "motor-acceleration-study-analysis",
  "energy-auditing-service",
  "power-quality-analysis",
  "power-system-study-analysis",
  "load-flow-study-analysis",
  "short-circuit-study-analysis",
  "relay-coordination-study-analysis",
  "arc-flash-study",
  "harmonic-study-analysis",
  "voltage-imbalance-study",
  "frequency-stability-analysis",
  "vibration-study-analysis",
  // Strapi-existing variants
  "arc-flash-study-analysis",
  "load-flow-analysis",
  "power-quality-study-analysis",
  "power-restoration-optimization",
  "power-system-study-analysis",
  "relay-coordination-study-and-analysis",
  "vibration-study-and-analysis",
  "grounding-grid-study-analysis",
  "grounding-system-design-and-planning",
  "frequency-stability-analysis",
  "voltage-imbalance-study",
]);

export function categorizeAEService(slug: string): AEServiceCategory {
  // Normalize: strip -ae suffix that Strapi adds
  const clean = slug.endsWith("-ae") ? slug.slice(0, -3) : slug;

  if (TESTING.has(clean)) return "Testing";
  if (CALIBRATION.has(clean)) return "Calibration";
  if (INSPECTION.has(clean)) return "Inspection";
  if (STUDY.has(clean)) return "Study & Analysis";

  // Heuristic fallback for slugs not in the explicit map
  if (/study|analysis|assessment/.test(clean)) return "Study & Analysis";
  if (/calibration/.test(clean)) return "Calibration";
  if (/inspection|audit|certification/.test(clean)) return "Inspection";
  if (/test|testing/.test(clean)) return "Testing";

  return "Study & Analysis";
}

export const AE_CATEGORIES_ORDER: AEServiceCategory[] = [
  "Testing",
  "Calibration",
  "Inspection",
  "Study & Analysis",
];

export const CATEGORY_TO_SLUG: Record<AEServiceCategory, string> = {
  "Testing": "testing",
  "Calibration": "calibration",
  "Inspection": "inspection",
  "Study & Analysis": "study-and-analysis",
};

export const SLUG_TO_CATEGORY: Record<string, AEServiceCategory> = {
  "testing": "Testing",
  "calibration": "Calibration",
  "inspection": "Inspection",
  "study-and-analysis": "Study & Analysis",
};

export const CATEGORY_TAGLINES: Record<AEServiceCategory, string> = {
  "Testing": "Browse Testing services.",
  "Calibration": "Browse Calibration services.",
  "Inspection": "Browse Inspection services.",
  "Study & Analysis": "Browse Study & Analysis services.",
};

export interface CategorizedService {
  slug: string;
  cleanSlug: string;
  title: string;
}

export function groupServicesByCategory<T extends { slug: string; title: string }>(
  services: T[]
): Record<AEServiceCategory, T[]> {
  const grouped: Record<AEServiceCategory, T[]> = {
    "Testing": [],
    "Calibration": [],
    "Inspection": [],
    "Study & Analysis": [],
  };
  for (const svc of services) {
    grouped[categorizeAEService(svc.slug)].push(svc);
  }
  for (const cat of AE_CATEGORIES_ORDER) {
    grouped[cat].sort((a, b) => a.title.localeCompare(b.title));
  }
  return grouped;
}
