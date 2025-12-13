"use server";
import appConfig from "@/appConfig";
import { handleResponse } from "@/lib/utils/commonFunctions";

export async function getHome(params: any) {  
    const {
      featured,
      isNewArrival,
    perPage,
    page,
  } = params;

  let queryString = "";

  if (perPage && page) {
    queryString += `perPage=${perPage}&page=${page}&`;
  }

  if (featured) {
    queryString += `featured=${featured}&`;
  }

  if (isNewArrival) {
    queryString += `isNewArrival=${isNewArrival}&`;
  }

  const res = await fetch(`${appConfig.apiUrl}/home?${queryString}`, {
    cache: "no-cache",
    // headers,
  });
  return handleResponse(res);
}
