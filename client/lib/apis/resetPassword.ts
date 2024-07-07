import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function resetPassword(data: any, token: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `http://localhost:3900/api/v1/auth/reset-password/${token}`,
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
