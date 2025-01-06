"use server";

import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Function to get dashboard reports
export async function getDashboardReports(params: {
  startDate?: string;
  endDate?: string;
}) {
  const { startDate, endDate } = params;
  const headers = await getAuthHeaders();

  const queryParams = new URLSearchParams();

  if (startDate) {
    queryParams.append("startDate", startDate);
  }

  if (endDate) {
    queryParams.append("endDate", endDate);
  }

  const res = await fetch(
    `${appConfig.apiUrl}/reports/dashboard?${queryParams.toString()}`,
    {
      cache: "no-cache",
      headers,
    }
  );
  return await handleResponse(res);
}

// Function to get top-selling products
export async function getTopSellingProducts() {
  const res = await fetch(
    `${appConfig.apiUrl}/reports/top-selling-products`,
    {
      cache: "no-cache",
    }
  );
  return await handleResponse(res);
}
