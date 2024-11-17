"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function getPublicCategories() {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/all`, {
    next: { revalidate: 30 },
  });

  return await handleResponse(res);
}

export async function getAntdCategories() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/antd`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function getCategories() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
export async function saveCategory(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function updateCategory(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function deleteCategory(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/categories/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
