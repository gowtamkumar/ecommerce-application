"use server";

import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Function to send a forgot password request
export async function sendForgotPassword(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/auth/forgot-password`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}
