import { UploadFile } from "antd";
import { getImageUrl } from "./imageUrl";

// Extract the object key from a full MinIO/public URL if present
function toObjectKey(value: string): string {
  if (/^https?:\/\//i.test(value)) {
    return decodeURIComponent(value.split("/").pop() || value);
  }
  return value;
}

export function imageSetFile(filename: string) {
  const isUrl = /^https?:\/\//i.test(filename);
  const objectKey = toObjectKey(filename);

  const uploadedFile: UploadFile = {
    uid: Date.now().toString(),
    name: `${objectKey}`,
    status: "done",
    url: isUrl ? filename : getImageUrl(filename),
    fileName: objectKey,
  };

  return uploadedFile;
}

export const generateFile = (fileName: string, identifier: string | number) => ({
  uid: `${Math.random() * 1000}`,
  name: `photo ${identifier}`,
  status: "done",
  fileName: toObjectKey(fileName),
  url: /^https?:\/\//i.test(fileName) ? fileName : getImageUrl(fileName),
});