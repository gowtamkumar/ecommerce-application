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

export async function saveOrder(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveOrder:", error);
    throw error;
  }
}

export async function getOrders() {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getOrders:", error);
    throw error;
  }
}

export async function getOrderTracking(params: { trackingNo: string }) {
  try {
     const session = await getServerSession(authOptions);
    const query = new URLSearchParams(params).toString();
    
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/orders/tracking?${query}`,
      {
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getOrderTracking:", error);
    throw error;
  }
}

export async function getUserOrders() {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders/user-orders`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    throw error;
  }
}

export async function updateOrder(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders/${data.id}`, {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateOrder:", error);
    throw error;
  }
}

export async function orderReview(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders/review/${data.id}`, {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in orderReview:", error);
    throw error;
  }
}

export async function orderStatusUpdate(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders/order-status-update/${data.id}`, {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in orderStatusUpdate:", error);
    throw error;
  }
}

export async function assignDeliveryMan(data: any) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders/assign/${data.id}`, {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in assignDeliveryMan:", error);
    throw error;
  }
}

export async function deleteOrder(id: string) {
  try {
     const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/orders/${id}`, {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    throw error;
  }
}
