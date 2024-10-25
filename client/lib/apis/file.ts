"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

// Function to handle API responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

export async function saveFile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/files`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in saveFile:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function uploadFile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/files/uploads`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: data, // Assuming 'data' is a FormData object for file uploads
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in uploadFile:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function fileDeleteWithPhoto(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/files/delete-file-with-photo`,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in fileDeleteWithPhoto:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getFiles() {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/files`, {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getFiles:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function updateFile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/files/${data.id}`, {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in updateFile:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function getFile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/files/${data.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in getFile:", error);
    throw error; // Re-throw the error for further handling
  }
}

export async function deleteFile(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const res = await fetch(`${appConfig.apiUrl}/api/v1/files/${id}`, {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
    });

    return await handleResponse(res);
  } catch (error) {
    console.error("Error in deleteFile:", error);
    throw error; // Re-throw the error for further handling
  }
}
