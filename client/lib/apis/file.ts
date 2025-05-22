"use server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../authOption";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";
import appConfig from "@/appConfig";
import { auth } from "@/auth";

export async function saveFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
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

  return await handleResponse(res);
}

export async function fileDeleteWithPhoto(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/files/delete-file-with-photo`,
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
  const res = await fetch(`${appConfig.apiUrl}/files`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function updateFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getFile(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/${data.id}`, {
    method: "GET",
    headers,
  });

  return await handleResponse(res);
}

export async function deleteFile(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/files/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
