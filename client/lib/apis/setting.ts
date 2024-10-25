"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Define an interface for setting data
interface Setting {
  id?: string;
  [key: string]: any; // Allows for additional properties
}

// Define the response structure (if known, you can be more specific)
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a setting
export async function saveSetting(data: Setting): Promise<ApiResponse<Setting>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }
  
  return res.json();
}

// Function to get all settings
export async function getSettings(): Promise<ApiResponse<Setting[]>> {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/settings`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to get a specific setting
export async function getSetting(id: string): Promise<ApiResponse<Setting>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/settings/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to update a setting
export async function updateSetting(data: Setting): Promise<ApiResponse<Setting>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/settings/${data.id}`,
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
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to delete a setting
export async function deleteSetting(id: string): Promise<ApiResponse<null>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/settings/${id}`,
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
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}
