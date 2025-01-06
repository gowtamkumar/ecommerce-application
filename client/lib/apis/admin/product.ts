"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

export async function saveProduct(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/products`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

interface getParams {
  brandId?: any;
  categoryId?: any;
  colorId?: any;
  maxPrice?: string;
  rating?: string;
  minPrice?: string;
  search?: string;
  lowPrice?: string;
  highPrice?: string;
  discount?: number;
  status?: boolean;
}

export async function getProducts() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/products`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to get products");
  }
  return res.json();
}

export async function getProduct(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/products/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function updateProduct(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/products/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteProduct(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/products/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
