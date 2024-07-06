/* eslint-disable react-hooks/rules-of-hooks */
"use server";

// import { useSession } from "next-auth/react";

export async function saveBrand(data: any) {
  // const session = useSession();
  // console.log("🚀 ~ session brand:", session)

  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/brands`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getBrands() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/brands`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateBrand(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/brands/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteBrand(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/brands/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.json();
}
