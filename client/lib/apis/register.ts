'use server'
export async function register(data: any) {
  console.log("🚀 ~ data:", data)
  console.log("ddddddd", process.env.NEXT_SERVER_URL);

  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}
