import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your account, orders, and wishlist.",
  robots: { index: false, follow: false },
};


export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return <main>{children}</main>;
}
