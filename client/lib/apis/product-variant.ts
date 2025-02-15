"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveProductVariant(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/product-variants`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getProductVariants() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/product-variants`, {
    headers,
  });
  return await handleResponse(res);
}

export async function getProductVariant(data: { id: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/product-variants/${data.id}`,
    {
      method: "GET",
      headers,
    }
  );
  return await handleResponse(res);
}

export async function updateProductVariant(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/product-variants/${data.id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    }
  );
  return await handleResponse(res);
}

export async function deleteProductVariant(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/product-variants/${id}`, {
    method: "DELETE",
    headers,
  });
  return await handleResponse(res);
}
