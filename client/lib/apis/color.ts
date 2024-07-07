"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveColor(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/colors`, {
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

export async function getColors() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/colors`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function updateColor(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/colors/${data.id}`,
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

export async function deleteColor(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/colors/${id}`,
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
