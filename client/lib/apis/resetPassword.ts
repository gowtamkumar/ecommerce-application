export async function resetPassword(data: any, token: any) {
  console.log("data, token", data, token);
  
  const res = await fetch(
    `http://localhost:3900/api/v1/auth/forgot-password/${token}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}
