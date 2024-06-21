"use server";
export async function saveAddress(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/address`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAddresss() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/address`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateAddress(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/address/${data.id}`,
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

export async function deleteAddress(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/address/${id}`,
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
