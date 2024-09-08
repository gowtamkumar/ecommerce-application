import WebFooter from "@/components/website/footer/Footer";
import Header from "@/components/website/header/Header";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";
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
    <main>
      <Header />
      <div className="w-8/12 mx-auto">{children}</div>
      {/* <WebFooter /> */}
    </main>
  );
}
