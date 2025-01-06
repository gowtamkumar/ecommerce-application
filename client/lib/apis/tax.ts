"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Define an interface for the tax
interface Tax {
  id?: string; // Optional for new taxes
  name: string; // Required field for tax name
  rate: number; // Required field for tax rate
  description?: string; // Optional field for tax description
  [key: string]: any; // Allow additional properties
}

// Define the response structure
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new tax
export async function saveTax(data: Tax) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/taxs`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to get all taxes
export async function getTaxs() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/taxs`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Function to update a tax
export async function updateTax(data: Tax) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/taxs/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to delete a tax by ID
export async function deleteTax(id: string): Promise<ApiResponse<null>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/taxs/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
