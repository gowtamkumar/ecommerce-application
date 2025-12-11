import { uploadFile } from "@/lib/apis/file";
import { getUploadImageUrl } from "./imageUrl";

export const handleGlobalUpload = async ({
  file,
  filename,
  onSuccess,
  onError,
}: any) => {
  const formData = new FormData();
  formData.append(filename, file);

  try {
    const res = await uploadFile(formData);
    if (!res || !res.data) {
      throw new Error("Invalid response format");
    }
    const uploadedFilename = res.data[0].filename;
    const newFile = {
      uid: Math.random() * 1000 + "",
      name: `photo ${Math.random() * 10000 + ""}`,
      status: "done",
      fileName: uploadedFilename,
      url: getUploadImageUrl(uploadedFilename),
    };
    const newFileName = res.data.length ? uploadedFilename : null;

    if (onSuccess) onSuccess("Ok");

    return { newFile, newFileName };
  } catch (err) {
    console.error("🚀 ~ Upload error:", err);
    if (onError) onError({ err });
    /* Return null or rethrow based on preference, rethrowing allows catch block in component to handle specific UI logic if needed, 
       but here we already handled onError. returning null is safer for awaiters. */
    return null; 
  }
};
