"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";
import appConfig from "@/config";

export async function backupDB() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.accessToken) {
    throw new Error("No access token found");
  }

  const res = await fetch(
    `${appConfig.apiUrl}/api/v1/settings/db-backup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      body: JSON.stringify({ a: 1, b: "Textual content" }),
    }
  );

  if (!res.ok) {
    throw new Error(`Error backing up database: ${res.statusText}`);
  }

  // Return the response JSON or status, depending on your needs
  return res.json();
}
