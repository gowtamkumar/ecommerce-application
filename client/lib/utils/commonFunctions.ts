import {
  setAction,
  setLoading,
  setPreviewImage,
  setPreviewOpen,
  setPreviewTitle,
} from "@/redux/features/global/globalSlice";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import { errorNotification, successNotification } from "./notification";

export const handleAsyncAction = async (
  asyncFn: () => Promise<any>,
  successMessage: string,
  dispatch: any
): Promise<any> => {
  try {
    dispatch(setLoading({ save: true }));
    const res = await asyncFn();
    console.log("🚀 ~ Response:", res);

    if (!res.success) {
      errorNotification({ message: res.message });
    }

    dispatch(setAction({}));
    console.log("call back function");

    successNotification({ message: successMessage });
    return res; // Return the successful response
  } catch (error: any) {
    // console.log("🚀 ~ Error:", error?.message);
    //
    const errorMessage = error?.message || "An unexpected error occurred";
    errorNotification({ message: errorMessage });

    // Return the error object or reject as a Promise
    return Promise.reject(error); // Ensures error propagation
  } finally {
    console.log("Finally block executed");
    dispatch(setLoading({}));
  }
};

export const handleAsyncDeleteAction = async (
  asyncFn: () => Promise<any>,
  successMessage: string,
  dispatch: any
) => {
  try {
    dispatch(setLoading({ save: true }));
    await asyncFn();
    // successNotification({ message: successMessage });

    // setTimeout(() => {
    //   dispatch(setLoading({ save: false }));
    //   dispatch(setAction({}));
    // }, 100);
  } catch (error: any) {
    errorNotification({ message: error.message });
    dispatch(setLoading({ save: false }));
    dispatch(setAction({}));
  } finally {
    successNotification({ message: successMessage });
    dispatch(setLoading({ save: false }));
    dispatch(setAction({}));
  }
};

export async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  // if (!session?.user?.accessToken) {
  //   throw new Error("User not authenticated");
  // }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
}

// Function to handle API responses
export async function handleResponse(res: Response) {
  // if (!res.ok) {
  //   const errorData = await res.json();
  //   console.log("🚀 ~ errorData:", errorData)
  //   // return errorData;
  //   throw new Error(errorData?.message || "An unexpected error occurred");
  // }

  return res.json();
}

// image Preview
export const handlePreview = async (file: any, dispatch: any) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
  }
  dispatch(setPreviewImage(file.url || file.preview));
  dispatch(setPreviewOpen(true));
  dispatch(
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    )
  );
};

export const handlePreviewCancel = (dispatch: any) => {
  dispatch(setPreviewOpen(false));
};

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const normFile = (e: { fileList: string }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

// image Preview end

// const handleSubmit = async (values: any) => {
//   try {
//     let newData = { ...values };
//     // return console.log("newData:", newData);
//     dispatch(setLoading({ save: true }));
//     const result = newData.id
//       ? await updateLead(newData)
//       : await saveLead(newData);

//     newData.id
//       ? successNotification({ message: "Successfully Updated" })
//       : successNotification({ message: "Successfully Added" });

//     setTimeout(async () => {
//       dispatch(setLoading({ save: false }));
//       dispatch(setAction({}));
//       form.resetFields();
//     }, 100);
//   } catch (error: any) {
//     errorNotification({ message: error.message });
//     dispatch(setLoading({ save: false }));
//     dispatch(setAction({}));
//   }
// };

// export const handleClose = (dispatch: any, form: any) => {
//   dispatch(setAction({}));
//   dispatch(setLoading({}));
//   form.resetFields();
// };
