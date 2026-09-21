/**
 * Build a URL-safe slug from a human-readable name/title.
 * Keeps the historic scheme (lowercase, spaces -> dashes) so existing URLs
 * generated before this util was extracted stay stable.
 */
export const createSlug = (value: string): string =>
  value.toLowerCase().trim().replace(/\s+/g, '-').replace(/-+/g, '-');
