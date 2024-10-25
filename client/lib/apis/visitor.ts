"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Define interfaces for visitor and API response
interface Visitor {
  id?: string; // Optional for new visitors
  name?: string; // Name of the visitor
  email?: string; // Email of the visitor
  // Include additional fields as necessary
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new visitor
export async function saveVisitor(data: Visitor): Promise<ApiResponse<Visitor>> {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/visitors`, {
    method: "POST",
    cache: 'no-cache',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to get all visitors
export async function getVisitors(): Promise<ApiResponse<Visitor[]>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/visitors`, {
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

// Function to get a specific visitor by ID
export async function getVisitor(id: string): Promise<ApiResponse<Visitor>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/visitors/${id}`, {
    method: "GET",
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

// Function to update a visitor
export async function updateVisitor(data: Visitor): Promise<ApiResponse<Visitor>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/visitors/${data.id}`, {
    method: "PUT",
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

// Function to delete a visitor by ID
export async function deleteVisitor(id: string): Promise<ApiResponse<null>> {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/visitors/${id}`, {
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
