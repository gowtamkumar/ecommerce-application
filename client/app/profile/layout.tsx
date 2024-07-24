import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await getServerSession(authOptions);
  if (!session?.token) {
    redirect("/");
  }

  return (
    <>
      <Header />
      <div className="lg:w-8/12 mx-auto">{children}</div>
      <WebFooter />
    </>
  );
}
