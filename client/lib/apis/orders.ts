"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveOrder(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/orders`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  // console.log("res.json()", await res.json());

  return await res.json();
}

export async function getOrders(params?: any) {
  const { status, returnedStatus, page, limit } = params || {};

  let queryString = "";

  if (status) {
    queryString += `status=${status}&`;
  }
  if (returnedStatus) {
    queryString += `returnedStatus=${returnedStatus}&`;
  }
  if (page) {
    queryString += `page=${page}&`;
  }
  if (limit) {
    queryString += `limit=${limit}&`;
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/orders?${queryString}`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function getOrderQuery(params: {
  trackingNo?: string;
  id?: string;
}) {
  const headers = await getAuthHeaders();
  const query = params.trackingNo
    ? `trackingNo=${params.trackingNo}`
    : `id=${params.id}`;

  const res = await fetch(`${appConfig.apiUrl}/orders/query?${query}`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function getUserOrders(
  params?: { status?: string; page?: number; limit?: number } | string,
) {
  const headers = await getAuthHeaders();
  let url = `${appConfig.apiUrl}/orders/user`;
  if (typeof params === "string") {
    if (params) url += `?status=${params}`;
  } else if (params) {
    const query = new URLSearchParams();
    if (params.status) query.append("status", params.status);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    const qs = query.toString();
    if (qs) url += `?${qs}`;
  }
  const res = await fetch(url, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function updateOrder(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/orders/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// export async function getOrder(id: string) {
//   const headers = await getAuthHeaders();
//   const res = await fetch(`${appConfig.apiUrl}/orders/${id}`, {
//     method: "GET",
//     cache: "no-cache",
//     headers,
//   });
//   return await handleResponse(res);
// }

export async function orderReview(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/orders/review/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function orderStatusUpdateApi(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/orders/order-status-update/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers,
      body: JSON.stringify(data),
    },
  );
  return await handleResponse(res);
}

export async function assignDeliveryMan(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/orders/assign/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function deleteOrder(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/orders/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
