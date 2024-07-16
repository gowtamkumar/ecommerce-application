"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../authOption";

export async function saveDistrict(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/districts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getDistricts() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/districts`, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function getDistrict(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/districts/${data.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

// export async function updateDistricts(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${process.env.NEXT_SERVER_URL}/api/v1/districts/${data.id}`,
//     {
//       method: "PUT",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user.accessToken}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );
//   return res.json();
// }

// export async function deleteDistricts(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${process.env.NEXT_SERVER_URL}/api/v1/districts/${id}`,
//     {
//       method: "DELETE",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user.accessToken}`,
//       },
//     }
//   );
//   return res.json();
// }
