"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

export async function saveComment(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/comments`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function getComments(params?: {
  page?: number;
  limit?: number;
  postId?: string;
}) {
  const { page, limit, postId } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;
  if (postId) queryString += `postId=${postId}&`;

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/comments${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      headers,
      cache: "no-cache",
    },
  );
  return await handleResponse(res);
}
