"use server";
import appConfig from "@/appConfig";
import { auth } from "@/auth";
import { getAuthHeaders } from "../utils/commonFunctions";

export async function saveFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function uploadFile(data: any) {
  const session = await auth();
  const res = await fetch(`${appConfig.apiUrl}/files/uploads`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: data, // Assuming 'data' is a FormData object for file uploads
  });

  return res.json();
}

export async function fileDeleteWithPhoto(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/delete-file-with-photo`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function deleteMultipleFilesWithPhoto(filenames: string[]) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/delete-files-with-photo`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify({ filenames }),
  });

  return res.json();
}

export async function getFiles(data: any) {
  const { page = "1", limit = "30", search } = data || {};

  let queryString = "";

  if (search) {
    queryString += `search=${search}&`;
  }

  if (page && limit) {
    queryString += `page=${page}&limit=${limit}&`;
  }

  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files?${queryString}`, {
    cache: "no-cache",
    headers,
  });

  return res.json();
}

export async function updateFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/${data.id}`, {
    method: "GET",
    headers,
  });

  return res.json();
}

export async function deleteFile(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return res.json();
}
