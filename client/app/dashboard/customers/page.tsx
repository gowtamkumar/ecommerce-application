"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default function Customer() {
  const session = useSession();

  if (!session) {
    redirect("/login");
  }
  return <div>Customer</div>;
}
