"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveStatus(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/status`, {
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

export async function getStatuss() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/status`, {
    cache: "no-cache",
    headers: {
      'Authorization': `Bearer ${session?.user.accessToken}`,
    }
  });
  return res.json();
}

export async function updateStatus(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/status/${data.id}`,
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

export async function deleteStatus(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/status/${id}`,
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
