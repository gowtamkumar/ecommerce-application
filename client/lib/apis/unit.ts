"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/appConfig";
import { getAuthHeaders } from "../utils/commonFunctions";

// Define an interface for the unit

// async function getAuthHeaders() {
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.accessToken) {
//     throw new Error("User not authenticated");
//   }
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${session.user.accessToken}`,
//   };
// }

// Function to save a new unit
export async function saveUnit(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }
  return res.json();
}

// Function to get all units
export async function getUnits() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }

  return res.json();
}

// Function to update a unit
export async function updateUnit(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }

  return res.json();
}

// Function to delete a unit by ID
export async function deleteUnit(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }

  return res.json();
}
