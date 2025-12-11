import appConfig from "@/appConfig";

/**
 * Get the full URL for an uploaded image
 * @param filename - The filename of the image (e.g., "image-123.jpg")
 * @param fallback - Optional fallback image path (defaults to "/default-placeholder.png")
 * @returns The full URL to the image or fallback
 */
export const getImageUrl = (
  filename: string | null | undefined,
  fallback: string = "/default-placeholder.png"
): string => {
  if (!filename || filename === "null" || filename === "undefined") {
    return fallback;
  }
  return `${appConfig.baseApiClientUrl}/uploads/${filename}`;
};

/**
 * Get image URL with "no-data.png" as fallback (for dashboard/admin components)
 * @param filename - The filename of the image
 * @returns The full URL to the image or no-data.png fallback
 */
export const getUploadImageUrl = (
  filename: string | null | undefined,
  fallback: string = "/default-placeholder.png"
): string => {
  return getImageUrl(filename, fallback);
};

/**
 * Get image URLs for a product (thumbnail and hover image)
 * @param thumbnailImage - The thumbnail image filename
 * @param hoverImage - The hover image filename
 * @param fallback - Optional fallback image path
 * @returns Object with thumbnailUrl and hoverUrl
 */
export const getProductImageUrls = (
  thumbnailImage: string | null | undefined,
  hoverImage: string | null | undefined,
  fallback: string = "/default-placeholder.png"
) => {
  return {
    thumbnailUrl: getImageUrl(thumbnailImage, fallback),
    hoverUrl: getImageUrl(hoverImage, fallback),
  };
};
