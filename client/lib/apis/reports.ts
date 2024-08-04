/* eslint-disable react-hooks/rules-of-hooks */
"use server";
import { authOptions } from "../authOption";
import { getServerSession } from "next-auth";

export async function getDashboardReports(params: any) {
  const { startDate, endDate } = params;
  const session = await getServerSession(authOptions);
  let dashboardQuery = "";

  // if (status) {
  //   dashboardQuery += `status=${status}`;
  // }

  if (startDate && endDate) {
    dashboardQuery += `startDate=${startDate}&endDate=${endDate}`;
  }

  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/reports/dashboard?${dashboardQuery}`,
    {
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
    }
  );
  return res.json();
}
