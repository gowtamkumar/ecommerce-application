"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";
import { notFound } from "next/navigation";

export async function saveCart(data: any) {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error saving cart: ${res.statusText}`);
  }

  return res.json();
}

export async function getCarts() {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error(`Error fetching carts: ${res.statusText}`);
  }

  return res.json();
}

export async function getCartByUser() {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts/user`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
  //  notFound()

    console.log(`Error fetching cart by user: ${res.statusText}`);
  }

  return res.json();
}

export async function updateCart(data: any) {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts/${data.id}`, {
    method: "PUT",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error updating cart: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteCart(id: string) {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/carts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error deleting cart: ${res.statusText}`);
  }

  return res.json();
}
