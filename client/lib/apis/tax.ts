"use server";
export async function saveTax(data: any) {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/taxs`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getTaxs() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/taxs`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function updateTax(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/taxs/${data.id}`,
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

export async function deleteTax(id: string) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/taxs/${id}`,
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
