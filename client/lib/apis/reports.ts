/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";

export async function getDashboardReports() {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/reports/dashboard`, {
    cache: "no-cache",
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}
