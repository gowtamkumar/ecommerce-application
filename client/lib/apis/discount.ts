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

export async function getFilterDiscounts(params?: { scope: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/discounts?scope=${params?.scope}`,
    {
      headers,
    }
  );

  return await handleResponse(res);
}

export async function getDiscount(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function getDiscountBySlug(slug: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/slug/${slug}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function getDiscountDetails(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/details/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
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
