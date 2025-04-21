"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

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
  perPage?: number;
  page?: number;
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
    perPage,
    page,
  }: getParams = params;

  console.log("params", params);

  let queryString = "status=Active&";

  if (perPage && page) {
    queryString += `perPage=${perPage}&page=${page}&`;
  }

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

  const res = await fetch(`${appConfig.apiUrl}/products?${queryString}`);

  return await handleResponse(res);
}

export async function getPublicProduct(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/products/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

export async function getProductBySlug(slug: string) {
  console.log("🚀 ~ slug:", slug);
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/products/slug/${slug}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
