'use server'
export default async function saveSize(data: any) {
  console.log("🚀 ~ data:", data);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/sizes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
