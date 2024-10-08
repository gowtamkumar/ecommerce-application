"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function saveShippingCharge(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/shipping-charges`,
    {
      method: "POST",
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

export async function getShippingCharges(params?: any) {

  let queryData = "";
  if (params?.divisionId) {
    queryData += `divisionId=${params?.divisionId}`;
  }

  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/shipping-charges?${queryData}`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}

export async function getShippingCharge({ data }: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/shipping-charges/${data.id}`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}

export async function updateShippingCharge(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/shipping-charges/${data.id}`,
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

export async function deleteShippingCharge(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/shipping-charges/${id}`,
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
