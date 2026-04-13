"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function getRefunds() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/refunds`, {
    method: "GET",
    cache: "no-cache",
    headers,
  } as any);
  return await res.json();
}

export async function getRefund(id: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/refunds/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  }as any);
  return await res.json();
}

export async function completeRefund(id: number, data: { transactionId: string; note?: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/refunds/${id}/complete`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  }as any);
  return await handleResponse(res);
}
