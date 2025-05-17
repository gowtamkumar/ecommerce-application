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

export async function getContacts() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/contacts`, {
    cache: "no-cache",
    headers,
  });

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
