// const BASE_URL = process.env.NEXTAUTH_URL + "/api/products";
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function getAllCategories() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/categories/all`,
      {
        next: { revalidate: 30 },
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("Failed to fetch data");
  }
}

export async function getCategories() {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/categories`,
      {
        // next: { revalidate: 30 },
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    // console.log("🚀 ~ error:", error);
    console.log("Failed to fetch data");
  }
}

export async function saveCategory(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/categories`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/categories/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/categories/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}
