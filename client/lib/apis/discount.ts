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

export async function getDiscounts(params?: {
  scope?: string;
  status?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  limit?: number;
}) {
  const headers = await getAuthHeaders();
  const queryParams = new URLSearchParams();

  if (params?.scope) queryParams.set("scope", params.scope);
  if (params?.status) queryParams.set("status", params.status);
  if (params?.endDate) queryParams.set("endDate", params.endDate);
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.perPage || params?.limit) {
    const limitVal = (params?.perPage || params?.limit)!.toString();
    queryParams.set("perPage", limitVal);
    queryParams.set("limit", limitVal);
  }

  const queryString = queryParams.toString();
  const res = await fetch(
    `${appConfig.apiUrl}/discounts${queryString ? `?${queryString}` : ""}`,
    {
      headers,
    },
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
  console.log("slug auth", slug);

  // const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/slug/${slug}`, {
    method: "GET",
    cache: "no-cache",
    // headers,
  });
  return handleResponse(res);
}

export async function getDiscountDetails(
  id: string,
  params?: { page?: number; perPage?: number; limit?: number; search?: string },
) {
  const headers = await getAuthHeaders();
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.perPage || params?.limit) {
    const limitVal = (params?.perPage || params?.limit)!.toString();
    queryParams.set("perPage", limitVal);
    queryParams.set("limit", limitVal);
  }
  if (params?.search) queryParams.set("search", params.search);

  const queryString = queryParams.toString();
  const res = await fetch(
    `${appConfig.apiUrl}/discounts/details/${id}${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      cache: "no-cache",
      headers,
    },
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
export async function discountStatusUpdate(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/discounts/status/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify({ status: data.status }),
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
