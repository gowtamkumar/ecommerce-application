"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveWishlist(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/wishlists`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (error) {
    throw error;
  }
}

export async function getWishlists() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/wishlists`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    });
    return res.json();
  } catch (error) {
    throw error;
  }
}

export async function updateWishlist(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/wishlists/${data.id}`,
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
  } catch (error) {
    throw error;
  }
}

export async function deleteWishlist(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/wishlists/${id}`,
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
  } catch (error) {
    throw error;
  }
}
