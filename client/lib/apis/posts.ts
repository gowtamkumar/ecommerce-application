"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../authOption";

export async function savePost(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/posts`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPosts() {
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/posts`, {
    cache: "no-cache",
  });
  return res.json();
}

export async function getPost(data: any) {
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/posts/${data.id}`,
    {
      method: "GET",
      cache: 'no-cache',
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.json();
}

export async function updatePost(data: any) {
  const session = await getServerSession(authOptions);
  const res = await fetch(
    `${process.env.NEXT_SERVER_URL}/api/v1/posts/${data.id}`,
    {
      method: "PUT",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );
  return res.json();
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions);
  const res = await fetch(`${process.env.NEXT_SERVER_URL}/api/v1/posts/${id}`, {
    method: "DELETE",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
  });
  return res.json();
}
