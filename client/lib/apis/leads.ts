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

export async function saveLead(data: any) {
  try {
    const res = await fetch(`${appConfig.apiUrl}/api/v1/leads`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveLead:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getLeads() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/leads`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getLeads:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updateLead(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/leads/${data.id}`, {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateLead:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteLead(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/leads/${id}`, {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteLead:", error);
    throw error; // Re-throw the error for further handling
  }
}
