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

export async function saveDiscount(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts`, {
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
    console.error("Error in saveDiscount:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getDiscounts() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getDiscounts:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getFilterDiscounts(params?: { type: string }) {
  const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/discounts?type=${params?.type}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    return res.json()
}


export async function updateDiscount(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/discounts/${data.id}`,
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
    console.error("Error in updateDiscount:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteDiscount(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/discounts/${id}`,
      {
        method: "DELETE",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteDiscount:", error);
    throw error; // Re-throw the error for further handling
  }
}
