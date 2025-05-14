"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Save a new Return
export async function saveReturn(data: any) {
  const res = await fetch(`${appConfig.apiUrl}/returns`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Retrieve all Returns
export async function getReturns() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/returns`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Update an existing Return
export async function updateReturn(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/returns/${data.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Delete a Return
export async function deleteReturn(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/returns/${id}`, {
    method: "DELETE",
    headers,
  });
  return await handleResponse(res);
}
