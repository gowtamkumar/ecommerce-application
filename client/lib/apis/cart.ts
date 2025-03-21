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

export async function getCartLists(params: {
  couponCode: number | string;
  shippingCost: number | string;
}) {
  const { couponCode, shippingCost } = params;
  let queryString = "";

  if (couponCode) {
    queryString += `couponCode=${couponCode}&`;
  }

  if (couponCode) {
    queryString += `shippingCost=${shippingCost}`;
  }

  const res = await fetch(
    `${appConfig.apiUrl}/carts/coupon-apply-cartlist?${queryString}`,
    {
      cache: "no-cache",
    }
  );

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

export async function deleteCart(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/carts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
