/* eslint-disable @next/next/no-async-client-component */
"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

export default async function AuthProvider({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
