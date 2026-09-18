"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Get Dashboard Stats / Reports
export async function getDashboardStats(params?: {
  startDate?: string;
  endDate?: string;
}) {
  const { startDate, endDate } = params || {};
  const headers = await getAuthHeaders();
  const queryParams = new URLSearchParams();

  if (startDate) {
    queryParams.append("startDate", startDate);
  }
  if (endDate) {
    queryParams.append("endDate", endDate);
  }

  const queryString = queryParams.toString();
  const url = `${appConfig.apiUrl}/reports/dashboard${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
