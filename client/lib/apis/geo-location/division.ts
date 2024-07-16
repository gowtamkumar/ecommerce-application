"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../authOption";

export async function saveDivision(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/divisions`, {
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

export async function getDivisions() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/divisions`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}

export async function getDivision(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/divisions/${data.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}

// export async function updateDivision(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${process.env.NEXT_SERVER_URL}/api/v1/divisions/${data.id}`,
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

// export async function deleteDivision(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${process.env.NEXT_SERVER_URL}/api/v1/divisions/${id}`,
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
