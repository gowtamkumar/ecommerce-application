"use server";

import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Define an interface for setting data
interface Setting {
  id?: string;
  [key: string]: any; // Allows for additional properties
}

// Define the response structure (if known, you can be more specific)
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a setting
export async function saveSetting(data: Setting) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to get all settings
export async function getSettings() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings`, {
    headers,
    cache: "no-cache",
  });

  return await handleResponse(res);
}

// Function to get a specific setting
export async function getSetting(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings/${id}`, {
    headers,
  });

  return await handleResponse(res);
}

// Function to update a setting
export async function updateSetting(data: Setting) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to delete a setting
export async function deleteSetting(id: string){
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
