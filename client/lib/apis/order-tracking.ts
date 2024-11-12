"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveOrderTracking(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getOrderTracking(data: { id: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/order-trackings/${data.id}`,
    {
      cache: "no-cache",
      headers,
    }
  );

  return await handleResponse(res);
}

export async function getOrderTrackings() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function updateOrderTracking(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/order-trackings/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers,
      body: JSON.stringify(data),
    }
  );

  return await handleResponse(res);
}

export async function deleteOrderTracking(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
