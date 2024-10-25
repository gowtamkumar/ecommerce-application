/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import appConfig from "@/config";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";


export async function saveBanner(data: any) {
  const session = await getServerSession(authOptions);
  
  const res = await fetch(`${appConfig.apiUrl}/api/v1/banners`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error saving banner: ${res.statusText}`);
  }

  return res.json();
}

export async function getBanners(params?: any) {
  const searchParams = new URLSearchParams();

  if (params?.type) {
    searchParams.append("type", params.type);
  }

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/banners?${searchParams.toString()}`,
    {
      // Uncomment the headers if authentication is needed
      // headers: {
      //   'Authorization': `Bearer ${accessToken}`,
      // },
    }
  );

  if (!res.ok) {
    throw new Error(`Error fetching banners: ${res.statusText}`);
  }

  return res.json();
}

export async function updateBanner(data: any) {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/banners/${data.id}`,
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
    throw new Error(`Error updating banner: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteBanner(id: string) {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/banners/${id}`,
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
    throw new Error(`Error deleting banner: ${res.statusText}`);
  }

  return res.json();
}
