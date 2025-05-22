"use server";
import appConfig from "@/appConfig";
import { auth } from "@/auth";
// import { authOptions } from "@/lib/authOption";
// import { getServerSession } from "next-auth";

export async function syncGeoLocation() {
  const session = await auth();
  const res = await fetch(`${appConfig.apiUrl}/divisions/sync-geo-locations`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });
  return res.json();
}
