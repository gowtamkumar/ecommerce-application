import appConfig from "@/appConfig";
import { UploadFile } from "antd";

export function imageSetFile(filename: string) {
  const uploadedFile: UploadFile = {
    uid: Date.now().toString(),
    name: `${filename}`,
    status: "done",
    url: `${appConfig.baseApiUrl}/uploads/${filename}`,
    fileName: filename,
  };

  return uploadedFile;
}
