"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Get Dashboard Stats
export async function getDashboardStats() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/reports/dashboard`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
