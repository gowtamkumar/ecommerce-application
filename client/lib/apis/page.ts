"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function getPageBySlug(slug: string) {
  const res = await fetch(`${appConfig.apiUrl}/pages/slug/${slug}`, {
    method: "GET",
    cache: "no-cache",
  });
  return handleResponse(res);
}

export async function getPages(params?: { status?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.status) {
    queryParams.append("status", params.status);
  }
  
  const url = `${appConfig.apiUrl}/pages${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  });
  return handleResponse(res);
}

// Admin functions
export async function createPage(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/pages`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updatePage(id: number, data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/pages/${id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deletePage(id: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/pages/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return handleResponse(res);
}

export async function getPageById(id: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/pages/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return handleResponse(res);
}
