"use server";
export async function saveProduct(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/products`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/products`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateProduct(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/products/${data.id}`,
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

export async function deleteProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/products/${id}`,
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
