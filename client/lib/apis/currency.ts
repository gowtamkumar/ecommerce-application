"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/appConfig";

export async function saveCurrency(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/currencies`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to save currency: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in saveCurrency:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getCurrencies() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/currencies`, {
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch currencies: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in getCurrencies:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updateCurrency(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/currencies/${data.id}`,
      {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to update currency: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in updateCurrency:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteCurrency(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/currencies/${id}`,
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
      throw new Error(`Failed to delete currency: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error in deleteCurrency:", error);
    throw error; // Re-throw the error for further handling
  }
}
