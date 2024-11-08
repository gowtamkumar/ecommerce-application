"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";
import { getAuthHeaders } from "../utils/commonFunctions";

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

export async function saveColor(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/colors`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }
  return await res.json();
}

export async function getColors() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/colors`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }

  return await res.json();
}

export async function updateColor(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/colors/${data.id}`, {
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

export async function deleteColor(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/colors/${id}`, {
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
