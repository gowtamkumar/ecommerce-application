"use server";

import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveStockAdjust(data: any) {
  console.log("data", data);

  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/stock-adjusts`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getStockAdjusts(params?: {
  page?: number;
  limit?: number;
  type?: string;
}) {
  const { page, limit, type } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;
  if (type) queryString += `type=${type}&`;

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/stock-adjusts${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers,
    },
  );
  return await handleResponse(res);
}

export async function getStockAdjust(data: { id: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/stock-adjusts/${data.id}`, {
    method: "GET",
    headers,
  });
  return await handleResponse(res);
}

export async function updateStockAdjust(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/stock-adjusts/${data.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function deleteStockAdjust(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/stock-adjusts/${id}`, {
    method: "DELETE",
    headers,
  });
  return await handleResponse(res);
}
