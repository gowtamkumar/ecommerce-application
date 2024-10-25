"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

interface Wishlist {
  id?: string;
  title: string;
  items: any;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.user?.accessToken}`,
  };
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new Error(`Error: ${errorResponse.message}`);
  }
  return res.json();
}

export async function saveWishlist(data: any) {
  try {
    return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error saving wishlist:", error);
    throw error;
  }
}

export async function getWishlists() {
  try {
    return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists`, {
      cache: "no-cache",
    });
  } catch (error) {
    console.error("Error fetching wishlists:", error);
    throw error;
  }
}

export async function updateWishlist(data: Wishlist) {
  try {
    return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists/${data.id}`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    throw error;
  }
}

export async function deleteWishlist(id: string) {
  try {
    return await fetchWithAuth(`${appConfig.apiUrl}/api/v1/wishlists/${id}`, {
      method: "DELETE",
      cache: "no-cache",
    });
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }
}

// "use server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "../authOption";
// import appConfig from "@/config";

// export async function saveWishlist(data: any) {
//   try {
//     const session = await getServerSession(authOptions);
//     const res = await fetch(`${appConfig.apiUrl}/api/v1/wishlists`, {
//       method: "POST",
//       cache: "no-cache",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session?.user?.accessToken}`,
//       },
//       body: JSON.stringify(data),
//     });
//     return res.json();
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getWishlists() {
//   try {
//     const session = await getServerSession(authOptions);
//     const res = await fetch(`${appConfig.apiUrl}/api/v1/wishlists`, {
//       cache: "no-cache",
//       headers: {
//         Authorization: `Bearer ${session?.user?.accessToken}`,
//       },
//     });
//     return res.json();
//   } catch (error) {
//     throw error;
//   }
// }

// export async function updateWishlist(data: any) {
//   try {
//     const session = await getServerSession(authOptions);
//     const res = await fetch(
//       `${appConfig.apiUrl}/api/v1/wishlists/${data.id}`,
//       {
//         method: "PUT",
//         cache: "no-cache",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.user?.accessToken}`,
//         },
//         body: JSON.stringify(data),
//       }
//     );
//     return res.json();
//   } catch (error) {
//     throw error;
//   }
// }

// export async function deleteWishlist(id: string) {
//   try {
//     const session = await getServerSession(authOptions);
//     const res = await fetch(
//       `${appConfig.apiUrl}/api/v1/wishlists/${id}`,
//       {
//         method: "DELETE",
//         cache: "no-cache",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.user?.accessToken}`,
//         },
//       }
//     );
//     return res.json();
//   } catch (error) {
//     throw error;
//   }
// }
