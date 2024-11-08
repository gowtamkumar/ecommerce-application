/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import appConfig from "@/config";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";
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

export async function saveBrand(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/brands`, {
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

export async function getBrands() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/brands`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to fetch leads");
  }

  return res.json();
}

export async function updateBrand(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/brands/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to fetch leads");
  }

  return res.json();
}

export async function deleteBrand(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/brands/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to fetch leads");
  }

  return res.json();
}
