'use server'
export async function sendForgotPassword(data: any) {
  console.log("process.env.NEXT_SERVER_URL", process.env.NEXT_SERVER_URL);
  
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/forgot-password`,
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
