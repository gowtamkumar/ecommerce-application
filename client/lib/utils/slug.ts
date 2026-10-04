/**
 * Generates a clean, URL-safe slug from any string.
 * - Supports Unicode letters & numbers (Bengali, English, Arabic, etc.)
 * - Strips punctuation and unsafe URL characters (?, /, #, &, %, +, =, <, >, ", ', @, :, ;, ~, *, !, (, ))
 * - Preserves Bengali combining vowel marks and virama ([\p{L}\p{M}\p{N}-])
 * - Collapses spaces and underscores to single hyphens
 * - Trims leading and trailing hyphens
 */
export const slugify = (text: string | null | undefined): string => {
  if (!text) return "";
  return String(text)
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};
