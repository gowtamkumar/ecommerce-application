'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

export async function sendForgotPassword(data: any) {
  const session = await getServerSession(authOptions);
  console.log("appConfig.apiUrl", appConfig.apiUrl);
  
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
  return res.json();
}
