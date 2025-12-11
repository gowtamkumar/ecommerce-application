"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "@/lib/utils/commonFunctions";

export interface GetAuditLogsParams {
  userId?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Get all audit logs with filters
 */
export async function getAuditLogs(params: GetAuditLogsParams = {}) {
  const {
    userId,
    action,
    resourceType,
    resourceId,
    startDate,
    endDate,
    search,
    page,
    limit,
  } = params;

  let queryString = "";

  if (userId) queryString += `userId=${userId}&`;
  if (action) queryString += `action=${action}&`;
  if (resourceType) queryString += `resourceType=${resourceType}&`;
  if (resourceId) queryString += `resourceId=${resourceId}&`;
  if (startDate) queryString += `startDate=${startDate}&`;
  if (endDate) queryString += `endDate=${endDate}&`;
  if (search) queryString += `search=${search}&`;
  if (page) queryString += `page=${page}&`;
  if (limit) queryString += `limit=${limit}&`;

  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/audit-logs?${queryString}`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

/**
 * Get audit history for a specific resource
 */
export async function getResourceAuditHistory(
  resourceType: string,
  resourceId: string
) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/audit-logs/resource/${resourceType}/${resourceId}`,
    {
      method: "GET",
      cache: "no-cache",
      headers,
    }
  );

  return await handleResponse(res);
}

/**
 * Get current user's activity history
 */
export async function getMyActivity() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/audit-logs/my-activity`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

/**
 * Get audit log statistics
 */
export async function getAuditLogStatistics(days: number = 30) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${appConfig.apiUrl}/audit-logs/statistics?days=${days}`,
    {
      method: "GET",
      cache: "no-cache",
      headers,
    }
  );

  return await handleResponse(res);
}
