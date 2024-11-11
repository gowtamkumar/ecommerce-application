"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders } from "../utils/commonFunctions";

export async function getAllCategories() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/all`, {
    next: { revalidate: 30 },

    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save discount");
  }

  return res.json();
}

export async function getCategories() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save discount");
  }
  return res.json();
}

export async function saveCategory(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories`, {
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

export async function updateCategory(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/${data.id}`, {
    method: "PUT",
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

export async function deleteCategory(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save discount");
  }

  return res.json();
}
