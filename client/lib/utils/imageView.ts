// import {
//   setPreviewImage,
//   setPreviewOpen,
//   setPreviewTitle,
// } from "@/redux/features/global/globalSlice";


// // file Preview
// export const handlePreview = async (file: any) => {
//   if (!file.url && !file.preview) {
//     file.preview = await getBase64(file.originFileObj);
//   }

//   setPreviewImage(file.url || file.preview);
//   setPreviewOpen(true);
//   setPreviewTitle(
//     file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
//   );
// };

// const getBase64 = (file: any) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
