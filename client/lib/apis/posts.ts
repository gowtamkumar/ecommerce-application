"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function savePost(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/posts`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getPosts() {
  const res = await fetch(`${appConfig.apiUrl}/posts`, {
    method: "GET",
    cache: "no-cache",
  });
  return await handleResponse(res);
}

export async function getPost(data: { id: string }) {
  const res = await fetch(`${appConfig.apiUrl}/posts/${data.id}`, {
    method: "GET",
    cache: "no-cache",
  });
  return await handleResponse(res);
}

export async function updatePost(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/posts/${data.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function deletePost(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/posts/${id}`, {
    method: "DELETE",
    headers,
  });
  return await handleResponse(res);
}
