"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

interface Wishlist {
  id?: string;
  title: string;
  items: any;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();
  const res = await fetch(url, { ...options, headers });
  return await handleResponse(res);
}

export async function saveWishlist(data: any) {
  return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists`, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
}

export async function getWishlists() {
  return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists`, {
    cache: "no-cache",
  });
}

export async function getUserWishlists() {
  return await fetchWithAuth(
    `${appConfig.apiUrl}/api/v1/wishlists/user-wishlist`,
    {
      cache: "no-cache",
    }
  );
}

export async function updateWishlist(data: Wishlist) {
  return await fetchWithAuth(
    `${appConfig.apiUrl}/api/v1/wishlists/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      body: JSON.stringify(data),
    }
  );
}

export async function deleteWishlist(id: string) {
  return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists/${id}`, {
    method: "DELETE",
    cache: "no-cache",
  });
}
