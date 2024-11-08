"use server";
import appConfig from "@/config";
import { getAuthHeaders } from "../utils/commonFunctions";

export async function saveDiscount(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save discount");
  }
  return res.json();
}

export async function getDiscounts() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to get discounts");
  }
  return res.json();
}

export async function getFilterDiscounts(params?: { type: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/discounts?type=${params?.type}`,
    {
      headers,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to get filter discount");
  }

  return res.json();
}

export async function updateDiscount(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to update discount");
  }
  return res.json();
}

export async function deleteDiscount(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to delete discount");
  }
  return res.json();
}
