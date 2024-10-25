"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Define an interface for the tax
interface Tax {
  id?: string; // Optional for new taxes
  name: string; // Required field for tax name
  rate: number; // Required field for tax rate
  description?: string; // Optional field for tax description
  [key: string]: any; // Allow additional properties
}

// Define the response structure
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new tax
export async function saveTax(data: Tax): Promise<ApiResponse<Tax>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/taxs`, {
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

// Function to get all taxes
export async function getTaxs(): Promise<ApiResponse<Tax[]>> {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${appConfig.apiUrl}/api/v1/taxs`, {
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

// Function to update a tax
export async function updateTax(data: Tax): Promise<ApiResponse<Tax>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/taxs/${data.id}`,
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

// Function to delete a tax by ID
export async function deleteTax(id: string): Promise<ApiResponse<null>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/taxs/${id}`, {
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
