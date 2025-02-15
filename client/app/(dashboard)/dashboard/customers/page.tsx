"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Customer() {
  const session = useSession();

  if (!session) {
    redirect("/login");
  }
  return <div>Customer</div>;
}
