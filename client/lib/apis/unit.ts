"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Function to save a new unit
export async function saveUnit(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/units`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res)
}

// Function to get all units
export async function getUnits() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/units`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res)
}

// Function to update a unit
export async function updateUnit(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/units/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res)
}

// Function to delete a unit by ID
export async function deleteUnit(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/units/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res)
}
