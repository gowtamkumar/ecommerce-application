"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

export async function saveMenu(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/menus`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function getMenus() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/menus`, {
    headers,
    cache: "no-cache",
  });

  return await handleResponse(res);
}

export async function getDashboardMenus() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/menus/dashboard`, {
    headers,
    cache: "no-cache",
  });
  return await handleResponse(res);
}

export async function updateMenu(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/menus/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function deleteMenu(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/menus/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
