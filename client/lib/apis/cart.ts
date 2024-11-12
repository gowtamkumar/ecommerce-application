"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveCart(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getCarts() {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts`, {
    cache: "no-cache",
  });

  return await handleResponse(res);
}

export async function getCartByUser() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts/user`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function updateCart(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteCart(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
