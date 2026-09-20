"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Function to save a review
export async function saveReview(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/reviews`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to get all reviews
export async function getReviews(params?: {
  page?: number;
  limit?: number;
  productId?: string;
}) {
  const { page, limit, productId } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;
  if (productId) queryString += `productId=${productId}&`;

  const headers = await getAuthHeaders();

  const res = await fetch(
    `${appConfig.apiUrl}/reviews${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-cache",
      headers,
    },
  );
  return await handleResponse(res);
}

// Function to update a review
export async function updateReview(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/reviews/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to like a review
export async function reviewLike(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/reviews/like/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to dislike a review
export async function reviewDisLike(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/reviews/dislike/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to delete a review
export async function deleteReview(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/reviews/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
