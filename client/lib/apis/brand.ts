/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";

export async function saveBrand(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/brands`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${session?.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getBrands() {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/brands`, {
    cache: "no-cache",
    headers: {
      'Authorization': `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function updateBrand(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/brands/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteBrand(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/brands/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}
