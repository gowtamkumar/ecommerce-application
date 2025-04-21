"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

export async function getHomeApi() {
  console.log("${appConfig.apiUrl}/home", `${appConfig.apiUrl}/home`);
  
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/home`, {
    cache: "no-cache",
    headers,
  });

  console.log("res", res);
  // console.log("res.json()", await res.json());

  return handleResponse(res);
}
