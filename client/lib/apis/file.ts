"use server";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";
import appConfig from "@/appConfig";

export async function saveFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/files`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function uploadFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/files/uploads`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: data, // Assuming 'data' is a FormData object for file uploads
  });

  return await handleResponse(res);
}

export async function fileDeleteWithPhoto(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/files/delete-file-with-photo`,
    {
      method: "POST",
      cache: "no-cache",
      headers,
      body: JSON.stringify(data),
    }
  );

  return await handleResponse(res);
}

export async function getFiles() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/files`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function updateFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/files/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/files/${data.id}`, {
    method: "GET",
    headers,
  });

  return await handleResponse(res);
}

export async function deleteFile(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/files/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
