"use server";
export async function saveUser(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/register`,
    {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/auth/users`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateUser(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/users/${data.id}`,
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

export async function deleteUser(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/auth/users/${id}`,
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
