"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveCurrency(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/currencies`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

   return await handleResponse(res);
}

export async function getCurrencies() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/currencies`, {
    cache: "no-cache",
    headers,
  });

   return await handleResponse(res);
}

export async function updateCurrency(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/currencies/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

   return await handleResponse(res);
}

export async function deleteCurrency(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/currencies/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

   return await handleResponse(res);
}
