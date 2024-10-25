"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

export async function saveDiscount(data: any) {
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

  return res.json();
}

export async function getDiscounts() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/discounts`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });
  return res.json();
}


export async function getFilterDiscounts(params?: { type: string }) {
  try {
    const session = await getServerSession(authOptions);
    console.log("🚀 ~ session:", session)
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/discounts?type=${params?.type}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    const text = await res.text();
    const data = JSON.parse(text);
    return data
  } catch (error) {
    console.error("Failed to parse response as JSON:", error);
    // throw new Error("Invalid response from server");
  }
}

export async function updateDiscount(data: any) {
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
  return res.json();
}

export async function deleteDiscount(id: string) {
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
  return res.json();
}
