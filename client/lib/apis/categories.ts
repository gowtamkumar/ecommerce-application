"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

export async function getAllCategories() {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/categories/all`,
    {
      next: { revalidate: 30 },
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    }
  );
  return  res.json();
}

export async function getCategories() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/categories`,
      {
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getCategories:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function saveCategory(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/categories`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to save category: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in saveCategory:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updateCategory(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/categories/${data.id}`,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update category: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in updateCategory:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/categories/${id}`,
      {
        method: "DELETE",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete category: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    throw error; // Re-throw the error for further handling
  }
}
