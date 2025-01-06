"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Save a new lead
export async function saveLead(data: any) {
  const res = await fetch(`${appConfig.apiUrl}/leads`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Retrieve all leads
export async function getLeads() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/leads`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Update an existing lead
export async function updateLead(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/leads/${data.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Delete a lead
export async function deleteLead(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/leads/${id}`, {
    method: "DELETE",
    headers,
  });
  return await handleResponse(res);
}
