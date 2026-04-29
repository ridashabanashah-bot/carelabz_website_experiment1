// Cleans noisy service titles coming from Strapi (and ultimately from the WordPress migration).
// Strips brand suffixes and normalizes ALL-CAPS to Title Case while preserving real acronyms.
// Used at render time so even if a Strapi entry slips in with bad casing, the user sees clean text.

const BRAND_SUFFIX_PATTERNS = [
  /\s*[|–—-]\s*Care\s*[Ll]ab[sz](?:\.com|\.me)?\s*$/i,
  /\s*[|–—-]\s*Carelabs\s+(?:UAE|United Arab Emirates|Dubai)\s*$/i,
];

const ACRONYMS = new Set([
  "DEWA", "NFPA", "IEEE", "OSHA", "IEC", "ETAP", "ISO", "ANSI",
  "MV", "LV", "ELV", "HV", "DC", "AC",
  "UAE", "USA", "UK", "EU",
  "RCD", "PFC", "PSC", "MCC", "PFCC",
  "GFCI", "RCBO", "MCB", "ELCB",
  "OFC", "PAT", "ATS", "FAT", "SAT",
  "VFD", "VSD", "CT", "VT", "PT",
  "HVAC", "PLC", "SCADA",
  "IR", "DC", "AC",
  "CO2", "PV",
]);

const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "of",
  "on", "or", "the", "to", "vs", "vs.", "via", "with", "from",
]);

function smartCapitalizeWord(word: string, isFirst: boolean): string {
  if (!word) return word;
  // Pure punctuation
  if (!/[A-Za-z]/.test(word)) return word;

  // Already mixed case (like "iPhone" or "ETAP-S") — leave alone
  if (/[a-z]/.test(word) && /[A-Z]/.test(word)) {
    return word;
  }

  // Slash- or hyphen-joined tokens (e.g. "PSC/PFC", "low-voltage")
  if (word.includes("/") || word.includes("-")) {
    const sep = word.includes("/") ? "/" : "-";
    return word
      .split(sep)
      .map((part, i) => smartCapitalizeWord(part, isFirst && i === 0))
      .join(sep);
  }

  const stripped = word.replace(/[^A-Za-z0-9]+$/, "");
  const trailing = word.slice(stripped.length);

  // Acronym / numeric chunk preserved
  const upper = stripped.toUpperCase();
  if (ACRONYMS.has(upper)) return upper + trailing;
  if (/^\d/.test(stripped)) return stripped + trailing;

  const lower = stripped.toLowerCase();
  if (!isFirst && SMALL_WORDS.has(lower)) return lower + trailing;

  return lower.charAt(0).toUpperCase() + lower.slice(1) + trailing;
}

function isMostlyUpper(s: string): boolean {
  const letters = s.replace(/[^A-Za-z]/g, "");
  if (letters.length < 4) return false;
  const upper = letters.replace(/[^A-Z]/g, "");
  return upper.length / letters.length >= 0.8;
}

function titleCase(s: string): string {
  // Tokenize on whitespace, preserve original spacing characters
  const parts = s.split(/(\s+)/);
  let firstWordSeen = false;
  return parts
    .map((tok) => {
      if (/^\s+$/.test(tok)) return tok;
      const isFirst = !firstWordSeen;
      firstWordSeen = true;
      return smartCapitalizeWord(tok, isFirst);
    })
    .join("");
}

export function cleanServiceTitle(raw: string | null | undefined): string {
  if (!raw) return "";
  let t = raw.trim();

  // Strip brand suffixes — apply repeatedly in case of stacked suffixes
  let prev: string;
  do {
    prev = t;
    for (const re of BRAND_SUFFIX_PATTERNS) {
      t = t.replace(re, "");
    }
    t = t.trim();
  } while (t !== prev);

  // Collapse internal whitespace
  t = t.replace(/\s{2,}/g, " ");

  // Normalize ALL-CAPS / mostly-upper titles
  if (isMostlyUpper(t)) {
    t = titleCase(t);
  }

  return t.trim();
}

// Short-form helper: drop trailing locale phrases for compact rendering (footer, tile dropdowns, etc.)
export function shortServiceLabel(raw: string | null | undefined): string {
  const cleaned = cleanServiceTitle(raw);
  return cleaned
    .replace(/\s*(?:in|at|for)\s+(?:Dubai|UAE|United Arab Emirates|Middle East)[^,]*$/i, "")
    .replace(/\s*Services?$/i, "")
    .replace(/\s*Service$/i, "")
    .trim() || cleaned;
}
