"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

export async function getHome() {  
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/home`, {
    cache: "no-cache",
    headers,
  });
  return handleResponse(res);
}
