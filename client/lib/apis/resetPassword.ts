export async function resetPassword(data: any, token: any) {
  
  const res = await fetch(
    `http://localhost:3900/api/v1/auth/reset-password/${token}`,
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
