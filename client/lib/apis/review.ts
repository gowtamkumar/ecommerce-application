"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Centralized function to handle API responses
async function handleResponse(res: any) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

// Function to save a review
export async function saveReview(data: any) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveReview:", error);
    throw error;
  }
}

// Function to get all reviews
export async function getReviews() {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getReviews:", error);
    throw error;
  }
}

// Function to update a review
export async function updateReview(data: any) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews/${data.id}`, {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateReview:", error);
    throw error;
  }
}

// Function to like a review
export async function reviewLike(data: any) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/reviews/like/${data.id}`,
      {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in reviewLike:", error);
    throw error;
  }
}

// Function to dislike a review
export async function reviewDisLike(data: any) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/reviews/dislike/${data.id}`,
      {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in reviewDisLike:", error);
    throw error;
  }
}

// Function to delete a review
export async function deleteReview(id: string) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(`${appConfig.apiUrl}/api/v1/reviews/${id}`, {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteReview:", error);
    throw error;
  }
}
