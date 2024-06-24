"use server";
export async function saveWishlist(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/wishlists`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getWishlists() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/wishlists`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateWishlist(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/wishlists/${data.id}`,
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

export async function deleteWishlist(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/wishlists/${id}`,
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
