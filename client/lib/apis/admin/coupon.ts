/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function getCoupons() {
  const res = await fetch(`${appConfig.apiUrl}/coupons`, {
    method: "GET",
    cache: "no-cache",
  });
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
