"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveUser(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/register`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function getUsers() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/auth/users`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function updateUser(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/users/${data.id}`,
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

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/users/${id}`,
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
