"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function backupDB() {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/settings/db-backup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ a: 1, b: "Textual content" }),
    }
  );

  return res;
}


// const response = await fetch(`${config.apiBaseUrl + '/api/v1/files/db-backup'}`, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ a: 1, b: 'Textual content' }),
// })
