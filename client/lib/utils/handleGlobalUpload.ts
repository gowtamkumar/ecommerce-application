import { uploadFile } from "@/lib/apis/file";
import { imageSetFile } from "./imageSetFile";

export const handleGlobalUpload = async ({
  file,
  filename,
  onSuccess,
  onError,
}: any) => {
  const formData = new FormData();
  formData.append(filename || "image", file);

  try {
    const res = await uploadFile(formData);
    console.log("res", res);

    if (!res || !res.data) {
      throw new Error(res?.message || res?.error || "Invalid response format");
    }
    const uploadedFilename = res.data[0].filename;
    const uploadedPublicUrl = res.data[0].path; // MinIO public URL

    const newFile = imageSetFile(uploadedFilename);
    newFile.url = uploadedPublicUrl; // preview straight from MinIO (no server redirect)

    const newFileName = res.data.length ? uploadedFilename : null;

    if (onSuccess) onSuccess("Ok");

    return {
      newFile,
      newFileName,
      newFileUrl: uploadedPublicUrl,
      entity: res.data[0],
      data: res.data,
    };
  } catch (err) {
    console.error("🚀 ~ Upload error:", err);
    if (onError) onError({ err });
    /* Return null or rethrow based on preference, rethrowing allows catch block in component to handle specific UI logic if needed, 
       but here we already handled onError. returning null is safer for awaiters. */
    return null;
  }
};
