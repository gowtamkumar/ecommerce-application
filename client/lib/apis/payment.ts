"use server";

import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function savePayment(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/payments`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function saveDashboardPayment(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/payments/dashboard`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getPayments() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/payments`, {
    method: "GET",
    headers,
  });
  return await handleResponse(res);
}

export async function getPayment(data: { id: string }) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/payments/${data.id}`, {
    method: "GET",
    headers,
  });
  return await handleResponse(res);
}

export async function updatePayment(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/payments/${data.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function deletePayment(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/payments/${id}`, {
    method: "DELETE",
    headers,
  });
  return await handleResponse(res);
}
