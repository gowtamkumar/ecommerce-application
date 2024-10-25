"use server";

import appConfig from "@/config";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";

// Centralized function to handle API responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

// Function to get dashboard reports
export async function getDashboardReports(params: { startDate?: string; endDate?: string }) {
  const { startDate, endDate } = params;
  const session = await getServerSession(authOptions);

  const queryParams = new URLSearchParams();
  
  if (startDate) {
    queryParams.append('startDate', startDate);
  }
  
  if (endDate) {
    queryParams.append('endDate', endDate);
  }

  try {
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/reports/dashboard?${queryParams.toString()}`,
      {
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getDashboardReports:", error);
    throw error;
  }
}

// Function to get top-selling products
export async function getTopSellingProducts() {
  try {
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/reports/top-selling-products`,
      {
        cache: "no-cache",
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getTopSellingProducts:", error);
    throw error;
  }
}
