/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import appConfig from "@/config";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";


export async function saveBrand(data: any) {
  const session = await getServerSession(authOptions);
  
  const res = await fetch(`${appConfig.apiUrl}/api/v1/brands`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error saving brand: ${res.statusText}`);
  }

  return res.json();
}

export async function getBrands() {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/brands`);

  if (!res.ok) {
    throw new Error(`Error fetching brands: ${res.statusText}`);
  }

  return res.json();
}

export async function updateBrand(data: any) {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/brands/${data.id}`,
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

  if (!res.ok) {
    throw new Error(`Error updating brand: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteBrand(id: string) {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/brands/${id}`,
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
    throw new Error(`Error deleting brand: ${res.statusText}`);
  }

  return res.json();
}
