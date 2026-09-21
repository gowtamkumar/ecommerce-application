/**
 * Get the full URL for an uploaded image
 * @param filename - The filename of the image (e.g., "image-123.jpg")
 * @param fallback - Optional fallback image path (defaults to "/default-placeholder.png")
 * @returns The full URL to the image or fallback
 */
export const getImageUrl = (
  filename: string | null | undefined,
  fallback: string = "/default-placeholder.png",
): string => {
  if (!filename || filename === "null" || filename === "undefined") {
    return fallback;
  }
  if (filename.startsWith("blob:") || filename.startsWith("data:")) {
    return filename;
  }

  const minioBase = (
    process.env.NEXT_PUBLIC_MINIO_PUBLIC_URL || "http://localhost:9010"
  ).replace(/\/$/, "");
  const minioBucket = process.env.NEXT_PUBLIC_MINIO_BUCKET || "ecommerce";
  const minioPrefix = `${minioBase}/${minioBucket}`;

  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    if (filename.startsWith(minioPrefix)) {
      return filename;
    }
    if (filename.includes("/uploads/")) {
      const cleanKey = decodeURIComponent(
        filename.split("/uploads/").pop() || "",
      );
      return `${minioPrefix}/${cleanKey}`;
    }
    return filename;
  }

  // Strip any leading slashes or "uploads/"
  const cleanFilename = filename.replace(/^(\/?uploads\/|\/)/, "");
  return `${minioPrefix}/${cleanFilename}`;
};

/**
 * Get image URL with "no-data.png" as fallback (for dashboard/admin components)
 * @param filename - The filename of the image
 * @returns The full URL to the image or no-data.png fallback
 */
export const getUploadImageUrl = (
  filename: string | null | undefined,
  fallback: string = "/default-placeholder.png",
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
  fallback: string = "/default-placeholder.png",
) => {
  return {
    thumbnailUrl: getImageUrl(thumbnailImage, fallback),
    hoverUrl: getImageUrl(hoverImage, fallback),
  };
};
