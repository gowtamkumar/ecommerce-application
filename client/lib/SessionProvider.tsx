/* eslint-disable @next/next/no-async-client-component */
"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./authOption.jsx";

export default async function AuthProvider({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
