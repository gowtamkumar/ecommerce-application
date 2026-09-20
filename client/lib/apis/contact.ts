"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveContact(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/contacts`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getContacts(params?: { page?: number; limit?: number }) {
  const { page, limit } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/contacts${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-cache",
      headers,
    },
  );

  return await handleResponse(res);
}

export async function getContact(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/contacts/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function updateContact(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/contacts/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteContact(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/contacts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
