"use server";
import appConfig from "@/appConfig";
import { handleResponse } from "@/lib/utils/commonFunctions";

export async function getHomeApi() {
  const res = await fetch(`${appConfig.apiUrl}/home`);
  return await handleResponse(res);
}
