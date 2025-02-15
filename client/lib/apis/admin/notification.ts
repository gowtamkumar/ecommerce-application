"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

// Retrieve all leads
export async function getNotifications() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/notifications`, {
    method: "GET",
    headers,
  });

  return res.json();
}

// Retrieve all leads
export async function readNotification(data: { id: string }) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/notifications/read/${data.id}`, {
    method: "GET",
    headers,
  });

  return res.json();
}

// Delete a lead
// Retrieve all leads
export async function clearAllNotifications() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${appConfig.apiUrl}/notifications/clear`, {
    method: "GET",
    headers,
  });
  return res.json();
}
