/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";

export async function saveBanner(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/banners`, {
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

export async function getBanners(params?: any) {
  let searchQuery = "";
  if (params?.type) {
    searchQuery += `type=${params.type}`;
  }
  const session = await getServerSession(authOptions);

  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/banners?${searchQuery}`,
    {
      // cache: "no-cache",
      // headers: {
      //   'Authorization': `Bearer ${session?.user.accessToken}`,
      // },
    }
  );
  return res.json();
}

export async function updateBanner(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/banners/${data.id}`,
    {
      method: "PATCH",
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

export async function deleteBanner(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/banners/${id}`,
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
