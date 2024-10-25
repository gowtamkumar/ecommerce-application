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

export async function saveProductVariant(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/product-variants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveProductVariant:", error);
    throw error;
  }
}

export async function getProductVariants() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/product-variants`, {
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getProductVariants:", error);
    throw error;
  }
}

export async function getProductVariant(data: { id: string }) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/product-variants/${data.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getProductVariant:", error);
    throw error;
  }
}

export async function updateProductVariant(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/product-variants/${data.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateProductVariant:", error);
    throw error;
  }
}

export async function deleteProductVariant(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/product-variants/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteProductVariant:", error);
    throw error;
  }
}
