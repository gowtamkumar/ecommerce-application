"use server";
export async function saveDiscount(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/discounts`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getDiscounts() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/discounts`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateDiscount(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/discounts/${data.id}`,
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

export async function deleteDiscount(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/discounts/${id}`,
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
