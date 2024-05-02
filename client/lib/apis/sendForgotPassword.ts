export async function sendForgotPassword(data: any) {
  const res = await fetch(`http://localhost:3900/api/v1/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
