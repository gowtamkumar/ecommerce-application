// const BASE_URL = process.env.NEXTAUTH_URL + "/api/products";
"use server";

export async function GetAllCategories() {
  try {
    // const { api } = params
    // const session = await getSession()

    // const session = await getServerSession(authOptions);
    // console.log("🚀 ~ session:", session);
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/categories/all`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    // console.log("🚀 ~ error:", error);
    console.log("Failed to fetch data");
  }
}

export async function GetCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_SERVER_URL}/api/v1/categories`,
      {
        // next: { revalidate: 30 },
        cache: "no-cache",
      }
    );

    if (!res.ok) {
      console.log("Failed to fetch data");
    }
    const result = await res.json();
    return result;
  } catch (error) {
    // console.log("🚀 ~ error:", error);
    console.log("Failed to fetch data");
  }
}

export async function saveCategory(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/categories`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/categories/${data.id}`,
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

export async function deleteCategory(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/categories/${id}`,
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
