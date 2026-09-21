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
  discountId?: number;
  status?: boolean;
  perPage?: number;
  page?: number;
  discountSlug?: string;
  featured?: boolean;
  isNewArrival?: boolean;
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
    discountId,
    discountSlug,
    featured,
    isNewArrival,
    perPage,
    page,
  }: getParams = params;

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

  if (discountId) {
    queryString += `discountId=${discountId}&`;
  }
  if (discountSlug) {
    queryString += `discountSlug=${discountSlug}&`;
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

  if (featured !== undefined) {
    queryString += `featured=${featured}&`;
  }

  if (isNewArrival !== undefined) {
    queryString += `isNewArrival=${isNewArrival}&`;
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
export async function getDashboardProducts(params?: {
  perPage?: number;
  page?: number;
  search?: string;
}) {
  const headers = await getAuthHeaders();
  const query = new URLSearchParams();
  if (params?.perPage) query.append("perPage", params.perPage.toString());
  if (params?.page) query.append("page", params.page.toString());
  if (params?.search) query.append("search", params.search);
  const queryString = query.toString() ? `?${query.toString()}` : "";

  const res = await fetch(
    `${appConfig.apiUrl}/products/dashboard${queryString}`,
    {
      method: "GET",
      headers,
    },
  );
  return await handleResponse(res);
}

export async function getProductBySlug(params: any) {
  const { slug, productVariantId } = params;
  let queryString = "";

  if (productVariantId) {
    queryString += `productVariantId=${productVariantId}`;
  }
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/products/slug/${slug}?${queryString}`,
    {
      method: "GET",
      cache: "no-cache",
      headers,
    },
  );
  return await handleResponse(res);
}
