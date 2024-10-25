"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";


export async function saveColor(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/colors`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to save color: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in saveColor:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getColors() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/colors`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch colors: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getColors:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updateColor(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/colors/${data.id}`,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update color: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in updateColor:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteColor(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/colors/${id}`,
      {
        method: "DELETE",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to delete color: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in deleteColor:", error);
    throw error; // Re-throw the error for further handling
  }
}
