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

export async function getPublicProduct(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/products/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

