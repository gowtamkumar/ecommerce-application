"use server";
import { getHeaders, getPostPutHeaders } from "../utils/commonFunctions";

// Save
export async function Save({ url, body }: { url: string; body: any }) {
  const newData = await getPostPutHeaders({ method: "POST", body });
  const res = await fetch(url, newData as RequestInit);
  return res.json();
}

// Gets
export async function Gets(url: string) {
  const get = await getHeaders({ method: "GET" });
  const res = await fetch(url, get as RequestInit);
  return res.json();
}

// Gets
export async function Get(url: string, id: string | number) {
  const get = await getHeaders({ method: "GET" });
  const res = await fetch(url, get as RequestInit);
  return res.json();
}

// Update
export async function Update({ url, body }: { url: string; body: any }) {
  const newData = await getPostPutHeaders({ method: "PATCH", body });
  const res = await fetch(url, newData as RequestInit);
  return res.json();
}

// Delete
export async function Delete(url: string) {
  console.log("url", url);

  const newData = await getHeaders({ method: "DELETE" });
  const res = await fetch(url, newData as RequestInit);
  return res.json();
}
