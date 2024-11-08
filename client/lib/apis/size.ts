"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Define an interface for the size

async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    throw new Error("User not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.user.accessToken}`,
  };
}

// Function to save a new size
export async function saveSize(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/sizes`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save size");
  }
  return res.json();
}

// Function to get all sizes
export async function getSizes() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/sizes`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to get sizes");
  }
  return res.json();
}

// Function to get a specific size by ID
export async function getSize(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/sizes/${id}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to get size");
  }

  return res.json();
}

// Function to update a size
export async function updateSize(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/sizes/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to update size");
  }
  return res.json();
}

// Function to delete a size by ID
export async function deleteSize(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/sizes/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }
  return res.json();
}
