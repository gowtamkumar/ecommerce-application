"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../authOption";
import appConfig from "@/appConfig";

export async function saveDivision(data: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/divisions`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error saving division: ${res.statusText}`);
  }

  return res.json();
}

export async function getDivisions() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/divisions`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching divisions: ${res.statusText}`);
  }

  return res.json();
}

export async function getDivision(data: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/divisions/${data.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching division: ${res.statusText}`);
  }

  return res.json();
}
// export async function updateDivision(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/divisions/${data.id}`,
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

// export async function deleteDivision(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/divisions/${id}`,
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
