"use server";
export async function saveSize(data: any) {
  console.log("🚀 ~ data:", data)
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/sizes`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getSizes() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/sizes`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateSize(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/sizes/${data.id}`,
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

export async function deleteSize(id: string) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/sizes/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}
