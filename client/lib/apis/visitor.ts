"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

interface Visitor {
  id?: string; // Optional for new visitors
  name?: string; // Name of the visitor
  email?: string; // Email of the visitor
  // Include additional fields as necessary
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new visitor
export async function saveVisitor(
  data: Visitor
): Promise<ApiResponse<Visitor>> {
  const res = await fetch(`${appConfig.apiUrl}/visitors`, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to get all visitors
export async function getVisitors(): Promise<ApiResponse<Visitor[]>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/visitors`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Function to get a specific visitor by ID
export async function getVisitor(id: string): Promise<ApiResponse<Visitor>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/visitors/${id}`, {
    method: "GET",
    headers,
  });
  return await handleResponse(res);
}

// Function to update a visitor
export async function updateVisitor(
  data: Visitor
): Promise<ApiResponse<Visitor>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/visitors/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to delete a visitor by ID
export async function deleteVisitor(id: string): Promise<ApiResponse<null>> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/visitors/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
