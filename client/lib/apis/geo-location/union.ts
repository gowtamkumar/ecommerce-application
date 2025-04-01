"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../authOption";
import appConfig from "@/appConfig";

export async function saveUnion(data: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/unions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error saving union: ${res.statusText}`);
  }

  return res.json();
}

export async function getUnions(params?: any) {
  const { upazilaId } = params;

  const queryData = upazilaId ? `?upazilaId=${upazilaId}` : "";
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/unions?${queryData}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching unions: ${res.statusText}`);
  }

  return res.json();
}

export async function getUnion(data: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/unions/${data.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching union: ${res.statusText}`);
  }

  return res.json();
}

// export async function updateUnion(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/unions/${data.id}`,
//     {
//       method: "PUT",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user?.accessToken}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );
//   return res.json();
// }

// export async function deleteUnion(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/unions/${id}`,
//     {
//       method: "DELETE",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user?.accessToken}`,
//       },
//     }
//   );
//   return res.json();
// }
