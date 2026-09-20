"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function getRefunds(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const { page, limit, status } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;
  if (status) queryString += `status=${status}&`;

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/refunds${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      cache: "no-cache",
      headers,
    } as any,
  );
  return await res.json();
}

export async function getRefund(id: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/refunds/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  } as any);
  return await res.json();
}

export async function completeRefund(
  id: number,
  data: { transactionId: string; note?: string },
) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/refunds/${id}/complete`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  } as any);
  return await handleResponse(res);
}
