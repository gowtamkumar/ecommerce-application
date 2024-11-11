'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/appConfig";

// Centralized function to handle API responses
async function handleResponse(res: any) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

// Function to send a forgot password request
export async function sendForgotPassword(data: any) {
  const session = await getServerSession(authOptions);
  console.log("appConfig.apiUrl", appConfig.apiUrl);
  
  try {
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      }
    );
    
    return await handleResponse(res);
  } catch (error) {
    console.error("Error in sendForgotPassword:", error);
    throw error;
  }
}
