"use server";
import appConfig from "@/appConfig";
import { handleResponse } from "@/lib/utils/commonFunctions";

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

export async function gethome() {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/home`);
  return await handleResponse(res);
}
