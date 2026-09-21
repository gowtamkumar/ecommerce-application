"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Get all notifications for the current user
export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  perPage?: number;
  status?: string;
  isRead?: boolean | string;
  type?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params) {
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.perPage !== undefined)
      query.set("perPage", String(params.perPage));
    if (params.status) query.set("status", String(params.status));
    if (params.isRead !== undefined) query.set("isRead", String(params.isRead));
    if (params.type) query.set("type", String(params.type));
    if (params.search) query.set("search", String(params.search));
  }
  const queryString = query.toString();

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
  perPage?: number;
  status?: string;
  isRead?: boolean | string;
  type?: string;
  search?: string;
  userId?: number | string;
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

  const query = new URLSearchParams();
  if (params) {
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.perPage !== undefined)
      query.set("perPage", String(params.perPage));
    if (params.status) query.set("status", String(params.status));
    if (params.isRead !== undefined) query.set("isRead", String(params.isRead));
    if (params.type) query.set("type", String(params.type));
    if (params.search) query.set("search", String(params.search));
    if (params.userId !== undefined) query.set("userId", String(params.userId));
  }
  const queryString = query.toString();

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

// Mark all notifications as read
export async function readAllNotifications() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/notifications/read-all`, {
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
