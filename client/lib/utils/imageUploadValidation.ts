import { errorNotification } from "./notification";

export function imageUploadSizeFileValidation(file: File): boolean {
  const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  const isImage = allowedTypes.includes(file.type);
  const isUnderLimit = file.size <= maxSizeInBytes;

  if (!isImage) {
    errorNotification({
      message: "Only JPG/PNG/JPEG files are allowed!",
    });
    return false;
  }

  if (!isUnderLimit) {
    errorNotification({
      message: "Image must be smaller than 1MB!",
    });
    return false;
  }

  return true;
}
