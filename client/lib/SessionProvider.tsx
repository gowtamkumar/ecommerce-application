"use client";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";

function AuthHandler({ children }: { children: React.ReactNode }) {
  const { data: session }: any = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  return <>{children}</>;
}

export default function AuthProvider({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <SessionProvider session={session}>
      <AuthHandler>{children}</AuthHandler>
    </SessionProvider>
  );
}
