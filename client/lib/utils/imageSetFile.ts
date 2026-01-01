import { UploadFile } from "antd";
import { getImageUrl } from "./imageUrl";

export function imageSetFile(filename: string) {
  const uploadedFile: UploadFile = {
    uid: Date.now().toString(),
    name: `${filename}`,
    status: "done",
    url: getImageUrl(filename),
    fileName: filename,
  };

  return uploadedFile;
}


 export const generateFile = (fileName: string, identifier: string | number) => ({
      uid: `${Math.random() * 1000}`,
      name: `photo ${identifier}`,
      status: "done",
      fileName,
      url: getImageUrl(fileName),
    });
