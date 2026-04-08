"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Define interfaces for user and API response
interface User {
  name?: string; // Optional for new users
  username: string; // Required field for username
  email: string; // Required field for email
  password?: string; // Optional field for password
  [key: string]: any; // Allow additional properties
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

// Function to save a new user
export async function saveUser(data: any) {
  console.log("data", data);
    const headers = await getAuthHeaders();
  
  const res = await fetch(`${appConfig.apiUrl}/auth/register`, {
    method: "POST",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to get the current user's information
export async function getMe() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/auth/me`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Function to get all users with pagination
export async function getUsers(page: number = 1, limit: number = 10) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/auth/users?page=${page}&limit=${limit}`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Function to update a user
export async function updateUser(data: any) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/auth/users/${data.id}`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to update the user's password
export async function updatePassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/auth/update-password`, {
    method: "PATCH",
    cache: "no-cache",
    headers,
    body: JSON.stringify(data),
  });

  return await handleResponse(res);
}

// Function to delete a user by ID
export async function deleteUser(id: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/auth/users/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
