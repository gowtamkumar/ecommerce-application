"use server";
import appConfig from "@/appConfig";
import { getAuthHeaders, handleResponse } from "../utils/commonFunctions";

// Define interfaces for user and API response
interface User {
  id?: string; // Optional for new users
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
export async function saveUser(data: User) {
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/register`, {
    method: "POST",
    cache: "no-cache",
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

// Function to get the current user's information
export async function getMe() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/me`, {
    method: "GET",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Function to get all users
export async function getUsers() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/users`, {
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}

// Function to update a user
export async function updateUser(data: User) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/users/${data.id}`, {
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
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/update-password`, {
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
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/users/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers,
  });

  return await handleResponse(res);
}
