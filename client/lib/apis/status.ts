"use server";
export async function saveStatus(data: any) {
  console.log("🚀 ~ data:", data);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/status`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getStatuss() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/status`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateStatus(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/status/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteStatus(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/status/${id}`,
    {
      method: "DELETE",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.json();
}
