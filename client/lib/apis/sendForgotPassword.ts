'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function sendForgotPassword(data: any) {
  const session = await getServerSession(authOptions);
  console.log("process.env.NEXT_SERVER_URL", process.env.NEXT_SERVER_URL);
  
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}
