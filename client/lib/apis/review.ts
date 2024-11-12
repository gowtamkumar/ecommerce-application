"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Function to save a review
export async function saveReview(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to get all reviews
export async function getReviews() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Function to update a review
export async function updateReview(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews/${data.id}`, {
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

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/reviews/like/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers,
      body: JSON.stringify(data),
    }
  );
  return await handleResponse(res);
}

// Function to dislike a review
export async function reviewDisLike(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/reviews/dislike/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers,
      body: JSON.stringify(data),
    }
  );
  return await handleResponse(res);
}

// Function to delete a review
export async function deleteReview(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}
