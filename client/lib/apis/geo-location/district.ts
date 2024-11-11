"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../authOption";
import appConfig from "@/appConfig";

export async function saveDistrict(data: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/districts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // You can customize this based on the error status
    throw new Error(`Error saving district: ${res.statusText}`);
  }

  return res.json();
}

export async function getDistricts(params: any) {
  const { divisionId } = params;

  // Build query parameters using URLSearchParams for flexibility
  const queryData = new URLSearchParams();
  if (divisionId) {
    queryData.append("divisionId", divisionId);
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/districts?${queryData.toString()}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching districts: ${res.statusText}`);
  }

  return res.json();
}

export async function getDistrict(data: any) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${appConfig.apiUrl}/api/v1/districts/${data.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error fetching district: ${res.statusText}`);
  }

  return res.json();
}

// export async function updateDistricts(data: any) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/districts/${data.id}`,
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

// export async function deleteDistricts(id: string) {
//   const session = await getServerSession(authOptions);
//   const res = await fetch(
//     `${appConfig.apiUrl}/api/v1/districts/${id}`,
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
