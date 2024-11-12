"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveProduct(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/products`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

interface getParams {
  brandId?: any;
  categoryId?: any;
  colorId?: any;
  maxPrice?: string;
  rating?: string;
  minPrice?: string;
  search?: string;
  lowPrice?: string;
  highPrice?: string;
  discount?: number;
  status?: boolean;
}

export async function getProducts() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/products`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to get products");
  }
  return res.json();
}

export async function getPublicProducts(params: getParams) {
  const {
    brandId,
    colorId,
    maxPrice,
    minPrice,
    search,
    lowPrice,
    highPrice,
    categoryId,
    rating,
    discount,
  }: getParams = params;

  let queryString = "status=Active&";

  if (brandId?.length > 0) {
    queryString += `brandId=${brandId}&`;
  }

  // if (categoryId.length > 0) {
  //   queryString += `categoryId=${categoryId.join(",")}${categoryId && "&"}`;
  // }

  if (categoryId?.length > 0) {
    queryString += `categoryId=${categoryId}&`;
  }

  if (colorId?.length > 0) {
    queryString += `colorId=${colorId}&`;
  }

  if (maxPrice) {
    queryString += `maxPrice=${maxPrice}&`;
  }

  if (minPrice) {
    queryString += `minPrice=${minPrice}&`;
  }

  if (lowPrice) {
    queryString += `lowPrice=${lowPrice}&`;
  }

  if (highPrice) {
    queryString += `highPrice=${highPrice}&`;
  }

  if (discount) {
    queryString += `discount=${discount}&`;
  }

  if (rating) {
    queryString += `rating=${rating}&`;
  }

  if (search) {
    queryString += `search=${search}&`;
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/products?${queryString}`);

  return await handleResponse(res);
}

export async function getProduct(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/products/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

export async function updateProduct(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/products/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

export async function deleteProduct(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/products/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
