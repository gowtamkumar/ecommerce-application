"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Function to handle API responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

export async function savePayment(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in savePayment:", error);
    throw error;
  }
}

export async function saveDashboardPayment(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/payments/dashboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveDashboardPayment:", error);
    throw error;
  }
}

export async function getPayments() {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/payments`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getPayments:", error);
    throw error;
  }
}

export async function getPayment(data: { id: string }) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/payments/${data.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getPayment:", error);
    throw error;
  }
}

export async function updatePayment(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/payments/${data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updatePayment:", error);
    throw error;
  }
}

export async function deletePayment(id: string) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/payments/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deletePayment:", error);
    throw error;
  }
}
