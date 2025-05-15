"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveReturn(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/returns`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await res.json();
}

// single-product

export async function returnOrder(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/returns/full-request`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function singleProductReturn(params: any) {
  const { orderItemId, status, approvedQty } = params;
  console.log("params", params);
  
  const headers = await getAuthHeaders();

  const res = await fetch(
    `${appConfig.apiUrl}/returns/single-product/${orderItemId}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers,
      body: JSON.stringify({ status, approvedQty }),
    }
  );
  return await handleResponse(res);
}
