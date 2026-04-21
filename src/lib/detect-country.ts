import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export function getCountryFromHeaders(
  headersList: ReadonlyHeaders | Headers,
  fallback: string = "US"
): string {
  try {
    return headersList.get("x-vercel-ip-country") || fallback;
  } catch {
    return fallback;
  }
}

export function getCountryName(iso2: string): string {
  const map: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    GB: "United Kingdom",
    AE: "UAE",
    GR: "Greece",
    IN: "India",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    JP: "Japan",
    CN: "China",
    BR: "Brazil",
    ZA: "South Africa",
    SG: "Singapore",
    MY: "Malaysia",
    SA: "Saudi Arabia",
    EG: "Egypt",
    NG: "Nigeria",
    PK: "Pakistan",
    BD: "Bangladesh",
  };
  return map[iso2] || "United States";
}
