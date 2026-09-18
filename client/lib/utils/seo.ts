/** Shared SEO text helpers */

export function stripHtml(value?: string) {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function absoluteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
