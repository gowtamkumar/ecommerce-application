"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Get all notifications for the current user
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  const { page, limit, status, type } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;
  if (status) queryString += `status=${status}&`;
  if (type) queryString += `type=${type}&`;

  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/notifications${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-cache",
      headers,
    } as any,
  );
  return await handleResponse(res);
}

// Get all notifications for the admin
export async function getNotificationsForAdmin(params?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  const headers: any = await getAuthHeaders();

  // If no token, skip the request to avoid backend errors
  if (!headers.Authorization) {
    return {
      success: false,
      message: "Authentication required",
      status: 401,
      data: [],
    };
  }

  const { page, limit, status, type } = params || {};
  let queryString = "";
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;
  if (status) queryString += `status=${status}&`;
  if (type) queryString += `type=${type}&`;

  const res = await fetch(
    `${appConfig.apiUrl}/notifications/admin${queryString ? `?${queryString}` : ""}`,
    {
      cache: "no-cache",
      headers,
    },
  );
  return await handleResponse(res);
}

// Get single notification
export async function getNotification(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/${id}`, {
    cache: "no-cache",
    headers,
  } as any);
  return await handleResponse(res);
}

// Mark notification as read
export async function readNotification({ id }: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/read/${id}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  } as any);
  return await handleResponse(res);
}

// Clear all notifications
export async function clearNotifications() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/clear`, {
    method: "GET",
    cache: "no-cache",
    headers,
  } as any);
  return await handleResponse(res);
}

// Delete a single notification
export async function deleteNotification(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  } as any);
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
  } as any);
  return await handleResponse(res);
}
