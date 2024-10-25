"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Define an interface for the status
interface Status {
  id?: string; // Optional for new statuses
  name: string; // Required field for status name
  description?: string; // Optional field for status description
  [key: string]: any; // Allow additional properties
}

// Define the response structure
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new status
export async function saveStatus(data: Status): Promise<ApiResponse<Status>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/status`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${session?.user?.accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to get all statuses
export async function getStatuses(): Promise<ApiResponse<Status[]>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/status`, {
    cache: "no-cache",
    headers: {
      'Authorization': `Bearer ${session?.user?.accessToken}`,
    }
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to update a status
export async function updateStatus(data: Status): Promise<ApiResponse<Status>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/status/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to delete a status by ID
export async function deleteStatus(id: string): Promise<ApiResponse<null>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/status/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${session?.user?.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}
