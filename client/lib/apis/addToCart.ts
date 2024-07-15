"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveTax(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/taxs`, {
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

export async function getTaxs() {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/taxs`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function updateTax(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/taxs/${data.id}`,
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

export async function deleteTax(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/taxs/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}
