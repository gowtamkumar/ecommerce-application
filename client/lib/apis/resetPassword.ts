
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Function to reset password
export async function resetPassword(data: any, token: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/auth/reset-password/${token}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    }
  );
  return await handleResponse(res);
}
