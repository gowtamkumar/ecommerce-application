import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  /** JSON body - automatically stringified. */
  body?: unknown;
  headers?: Record<string, string>;
  /** Attach the session Bearer token (default true). */
  auth?: boolean;
}

/**
 * Tiny typed HTTP client used by every "use server" API module.
 * Centralizes base URL, auth headers, JSON serialization, caching and the
 * standard { success, message, data } envelope - so API files only declare routes.
 */
async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, auth = true, ...rest } = options;
  const authHeaders = auth ? await getAuthHeaders() : { "Content-Type": "application/json" };

  // Default to no-cache unless the caller opts into coercion/revalidation (e.g. ISR).
  const fetchOptions: RequestInit = {
    ...rest,
    headers: { ...authHeaders, ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
  if (!rest.cache && !rest.next) {
    fetchOptions.cache = "no-cache";
  }

  const res = await fetch(`${appConfig.apiUrl}${path}`, fetchOptions);
  return handleResponse(res);
}

export const http = {
  get: <T = unknown>(path: string, options?: RequestOptions) => request<T>(path, { method: "GET", ...options }),
  post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body, ...options }),
  put: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PUT", body, ...options }),
  patch: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body, ...options }),
  remove: <T = unknown>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};

export default http;