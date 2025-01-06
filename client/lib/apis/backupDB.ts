"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function backupDB() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/settings/db-backup`, {
    method: "POST",
    headers,
    body: JSON.stringify({ a: 1, b: "Textual content" }),
  });
  return await handleResponse(res);
}
