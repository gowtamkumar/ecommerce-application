"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Define an interface for the unit
interface Unit {
  id?: string; // Optional for new units
  name: string; // Required field for unit name
  description?: string; // Optional field for unit description
  [key: string]: any; // Allow additional properties
}

// Define the response structure
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new unit
export async function saveUnit(data: Unit): Promise<ApiResponse<Unit>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units`, {
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

// Function to get all units
export async function getUnits(): Promise<ApiResponse<Unit[]>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to update a unit
export async function updateUnit(data: Unit): Promise<ApiResponse<Unit>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/units/${data.id}`,
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
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to delete a unit by ID
export async function deleteUnit(id: string): Promise<ApiResponse<null>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/units/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}
