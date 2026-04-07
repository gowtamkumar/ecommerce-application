"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveCart(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/carts`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getCarts() {
  const res = await fetch(`${appConfig.apiUrl}/carts`, {
    cache: "no-cache",
  });

  return await handleResponse(res);
}

export async function getCartLists(params?: {
  couponCode?: number | string;
  districtId?: number | string;
}) {
  const headers = await getAuthHeaders();
  const { couponCode, districtId }: any = params || {};
  
  const queryParams = new URLSearchParams();
  if (couponCode) queryParams.append('couponCode', String(couponCode));
  if (districtId) queryParams.append('districtId', String(districtId));
  
  const queryString = queryParams.toString();
  const finalUrl = queryString 
    ? `${appConfig.apiUrl}/carts/coupon-apply-cartlist?${queryString}` 
    : `${appConfig.apiUrl}/carts/coupon-apply-cartlist`;

  const res = await fetch(finalUrl, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function getCartByUser() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/carts/user`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function updateCart(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/carts/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function incrementDecrementCart(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/carts/qty-up-down/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteCart(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/carts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
