"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveOrder(data: any) {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ session:", session?.user.accessToken)
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/orders`, {
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

export async function getOrders() {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ session:", session)
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/orders`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function updateOrder(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/orders/${data.id}`,
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

export async function deleteOrder(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/orders/${id}`,
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
