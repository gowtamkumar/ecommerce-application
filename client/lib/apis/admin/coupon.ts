"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders } from "@/lib/utils/commonFunctions";

export async function saveCoupon(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/coupons`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCoupons(params?: {
  type?: string;
  page?: number;
  limit?: number;
}) {
  const { type, page, limit } = params || {};
  let queryString = "";
  if (type) queryString += `type=${type}&`;
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;

  const res = await fetch(
    `${appConfig.apiUrl}/coupons${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      cache: "no-cache",
    },
  );
  return res.json();
}

export async function getCoupon(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/coupons/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return res.json();
}

export async function updateCoupon(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/coupons/${data.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCoupon(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/coupons/${id}`, {
    method: "DELETE",
    headers,
  });
  return res.json();
}
