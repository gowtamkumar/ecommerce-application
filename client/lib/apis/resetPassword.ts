import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/appConfig";

// Centralized function to handle API responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error: ${res.status} - ${errorText}`);
  }
  return res.json();
}

// Function to reset password
export async function resetPassword(data: any, token: any) {
  const session = await getServerSession(authOptions);

  try {
    const res = await fetch(
      `${appConfig.apiUrl}/api/v1/auth/reset-password/${token}`,
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
    console.error("Error in resetPassword:", error);
    throw error;
  }
}
