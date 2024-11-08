"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Helper function to get the Authorization header
async function getAuthHeaders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    throw new Error("User not authenticated");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.user.accessToken}`,
  };
}

// Save a new lead
export async function saveLead(data: any) {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/leads`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to save lead");
  }

  return await res.json();
}

// Retrieve all leads
export async function getLeads() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/leads`, {
    cache: "no-cache",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to fetch leads");
  }

  return await res.json();
}

// Update an existing lead
export async function updateLead(data: any) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/leads/${data.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to update lead");
  }

  return await res.json();
}

// Delete a lead
export async function deleteLead(id: string) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/api/v1/leads/${id}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to delete lead");
  }

  return await res.json();
}
