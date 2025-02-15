"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveDiscount(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getDiscounts() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function getFilterDiscounts(params?: { type: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/discounts?type=${params?.type}`,
    {
      headers,
    }
  );

  return await handleResponse(res);
}

export async function updateDiscount(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteDiscount(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
