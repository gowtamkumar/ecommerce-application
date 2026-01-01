"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Get all notifications for the current user
export async function getNotifications() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Get all notifications for the current user
export async function getNotificationsForAdmin() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/admin`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Get single notification
export async function getNotification(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/${id}`, {
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Mark notification as read
export async function readNotification({ id }: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/read/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Clear all notifications
export async function clearNotifications() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/clear`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Delete a single notification
export async function deleteNotification(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });
  return await handleResponse(res);
}

// Send Promotional Notification (Admin)
export async function sendPromotionalNotification(data: {
  title: string;
  message: string;
  offerUrl: string;
  type?: string;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/promote`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}
