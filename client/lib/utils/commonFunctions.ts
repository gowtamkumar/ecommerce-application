import {
    setAction,
    setLoading,
    setPreviewImage,
    setPreviewOpen,
    setPreviewTitle,
} from "@/redux/features/global/globalSlice";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../authOption";
import { auth } from "@/auth";
import { errorNotification, successNotification } from "./notification";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  status?: number | string;
}

export type AsyncActionOptions = {
  loadingKey?: string;
  successMessage?: string;
  showSuccess?: boolean;
  showError?: boolean;
  clearAction?: boolean;
};

/**
 * Handle asynchronous actions with consistent loading, notification, and error handling.
 * Optimized for performance by reducing redundant dispatches and using finally for cleanup.
 */
export const handleAsyncAction = async <T>(
  asyncFn: () => Promise<ApiResponse<T>>,
  dispatch: any,
  options: AsyncActionOptions = {}
): Promise<T | null> => {
  const {
    loadingKey = "save",
    successMessage,
    showSuccess = true,
    showError = true,
    clearAction = true,
  } = options;

  try {
    dispatch(setLoading({ [loadingKey]: true }));
    const res = await asyncFn();

    if (!res.success) {
      if (showError) {
        errorNotification({ message: res.message || "Action failed" });
      }
      return null;
    }

    if (showSuccess) {
      successNotification({
        message: successMessage || res.message || "Action successful",
      });
    }

    if (clearAction) {
      dispatch(setAction({}));
    }

    return res.data ?? (res as any);
  } catch (error: any) {
    if (showError) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      errorNotification({ message: errorMessage });
    }
    return null;
  } finally {
    dispatch(setLoading({}));
  }
};

/**
 * Handle delete actions with specific messaging and cleanup logic.
 */
export const handleAsyncDeleteAction = async (
  asyncFn: () => Promise<ApiResponse<any>>,
  successMessage: string,
  dispatch: any
) => {
  try {
    dispatch(setLoading({ delete: true }));
    const res = await asyncFn();

    if (res.success) {
      successNotification({ message: successMessage || res.message || "Deleted successfully" });
      dispatch(setAction({}));
    } else {
      errorNotification({ message: res.message || "Delete failed" });
    }
  } catch (error: any) {
    errorNotification({
      message: error.message || "An unexpected error occurred",
    });
  } finally {
    dispatch(setLoading({}));
  }
};

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return {
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
}

export async function getPostPutHeaders({
  method,
  body,
}: {
  method: string;
  body: any;
}): Promise<RequestInit> {
  const session = await auth();
  return {
    method,
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(body),
  };
}

export async function getHeaders({ method }: { method: string }): Promise<RequestInit> {
  const session = await auth();
  return {
    method,
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  };
}

// Function to handle API responses
// Note: returns `any` on purpose - the response body shape of legacy endpoints
// varies; typed modules use the `http` client's generics instead.
export async function handleResponse(res: Response): Promise<any> {
  if (res.status === 401) {
    return {
      success: false,
      message: "Session expired. Please login again.",
      status: 401,
      data: null,
    };
  }

  // A non-JSON body (proxy 502, HTML error page...) is not a parseable API envelope.
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return {
      success: false,
      message: `Request failed (${res.status}). Please try again.`,
      status: res.status,
      data: null,
    };
  }

  try {
    return await res.json();
  } catch {
    return {
      success: false,
      message: `Request failed (${res.status}). Server returned an invalid response.`,
      status: res.status,
      data: null,
    };
  }
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
