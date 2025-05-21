import { errorNotification } from "./notification";

export function imageUploadSizeFileValidation(file: any, Upload: any) {
  const isAllowedType = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/bmp",
  ].includes(file.type);
  const isLt1M = file.size / 1024 / 1024 < 1;

  if (!isAllowedType) {
    errorNotification({
      message: "Only JPG/PNG/JPEG/BMP files are allowed!",
    });
    return Upload.LIST_IGNORE;
  }

  if (!isLt1M) {
    errorNotification({
      message: "Image must be smaller than 1MB!",
    });
    return Upload.LIST_IGNORE;
  }

  return true; // allow upload
}
