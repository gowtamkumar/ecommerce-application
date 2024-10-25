"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

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
export async function saveUser(data: User){
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/register`, {
    method: "POST",
    cache: "no-cache",
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

// Function to get the current user's information
export async function getMe() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/me`, {
    method: "GET",
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

// Function to get all users
export async function getUsers() {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/users`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to update a user
export async function updateUser(data: User) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/auth/users/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(`Error: ${res.status} - ${await res.text()}`);
  }

  return res.json();
}

// Function to update the user's password
export async function updatePassword(data: { oldPassword: string; newPassword: string }){
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/update-password`, {
    method: "PATCH",
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

// Function to delete a user by ID
export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${appConfig.apiUrl}/api/v1/auth/users/${id}`, {
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
