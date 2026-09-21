"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Define an interface for the shipping charge
interface ShippingCharge {
  id?: string; // Optional for new entries
  districtId: string;
  chargeAmount: number;
  description?: string; // Optional field
  [key: string]: any; // Allow additional properties
}

// Define the response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// Function to save a shipping charge
export async function saveShippingCharge(
  data: ShippingCharge,
): Promise<ApiResponse<ShippingCharge>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-charges`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  } as any);

  return await handleResponse(res);
}

// Function to get shipping charges with optional parameters
export async function getShippingCharges(params?: {
  districtId?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ShippingCharge[]>> {
  let queryData = "";
  if (params?.districtId) {
    queryData += `districtId=${params.districtId}&`;
  }
  if (params?.page) {
    queryData += `page=${params.page}&`;
  }
  if (params?.limit) {
    queryData += `limit=${params.limit}&`;
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-charges?${queryData}`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Function to get a specific shipping charge by ID
export async function getShippingCharge(
  id: string,
): Promise<ApiResponse<ShippingCharge>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-charges/${id}`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Function to update a shipping charge
export async function updateShippingCharge(
  data: ShippingCharge,
): Promise<ApiResponse<ShippingCharge>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-charges/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to delete a shipping charge by ID
export async function deleteShippingCharge(
  id: string,
): Promise<ApiResponse<null>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/shipping-charges/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
