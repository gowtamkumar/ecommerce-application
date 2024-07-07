"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveUnit(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/units`, {
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

export async function getUnits() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/units`, {
    cache: "no-cache",
    headers: {
      'Authorization': `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function updateUnit(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/units/${data.id}`,
    {
      method: "PUT",
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

export async function deleteUnit(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/units/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}
