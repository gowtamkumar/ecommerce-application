"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = true;
  const session = useSession();
  if (!user) {
    redirect("/");
  }

  return <div>{children}</div>;
}
