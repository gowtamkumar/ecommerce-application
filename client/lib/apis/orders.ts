"use server";
export async function saveOrder(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/orders`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/orders`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateOrder(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/orders/${data.id}`,
    {
      method: "PATCH",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deleteOrder(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/orders/${id}`,
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
