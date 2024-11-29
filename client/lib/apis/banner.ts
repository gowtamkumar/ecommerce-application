"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveBanner(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/banners`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getBanners(params?: any) {
  const searchParams = new URLSearchParams();
  console.log("🚀 ~ params:", params);

  if (params?.type) {
    searchParams.append("type", params.type);
  }

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/banners?${searchParams.toString()}`
  );

  return await handleResponse(res);
}

export async function updateBanner(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/banners/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteBanner(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/banners/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
