/**
 * Build a URL-safe slug from a human-readable name/title.
 * - Supports Unicode letters & numbers (Bengali, English, etc.)
 * - Strips unsafe URL characters (?, /, #, &, %, +, =, <, >, ", ', @, :, ;, ~, *, !, (, ))
 * - Collapses whitespace and underscores into single hyphens
 * - Trims leading and trailing hyphens
 */
export const createSlug = (value: string | null | undefined): string => {
  if (!value) return '';
  return String(value)
    .normalize('NFC')
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{M}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};
