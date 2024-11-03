/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import appConfig from "@/config";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";

export async function saveMenu(data: any) {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/menus`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error saving Menu: ${res.statusText}`);
  }

  return res.json();
}

export async function getMenus(params?: any) {
  const searchParams = new URLSearchParams();

  if (params?.type) {
    searchParams.append("type", params.type);
  }

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/menus?${searchParams.toString()}`,
    {
      // Uncomment the headers if authentication is needed
      // headers: {
      //   'Authorization': `Bearer ${accessToken}`,
      // },
    }
  );

  if (!res.ok) {
    throw new Error(`Error fetching Menus: ${res.statusText}`);
  }

  return res.json();
}

export async function updateMenu(data: any) {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/menus/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error updating Menu: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteMenu(id: string) {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/menus/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error deleting Menu: ${res.statusText}`);
  }

  return res.json();
}
