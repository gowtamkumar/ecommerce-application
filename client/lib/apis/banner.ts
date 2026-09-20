"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveBanner(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/banners`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getBanners(params?: any) {
  const searchParams = new URLSearchParams();

  if (params?.type) {
    searchParams.append("type", params.type);
  }
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }
  if (params?.limit) {
    searchParams.append("limit", params.limit.toString());
  }
  if (params?.active !== undefined) {
    searchParams.append("active", params.active.toString());
  }

  const res = await fetch(
    `${appConfig.apiUrl}/banners?${searchParams.toString()}`,
  );

  return await handleResponse(res);
}

export async function updateBanner(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/banners/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteBanner(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/banners/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
