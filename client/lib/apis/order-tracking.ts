"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";



// Function to handle API responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

export async function saveOrderTracking(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings`, {
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
    console.error("Error in saveOrderTracking:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getOrderTracking(data: { id: string }) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings/${data.id}`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getOrderTracking:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getOrderTrackings() {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getOrderTrackings:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updateOrderTracking(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings/${data.id}`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateOrderTracking:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteOrderTracking(id: string) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/order-trackings/${id}`, {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteOrderTracking:", error);
    throw error; // Re-throw the error for further handling
  }
}
