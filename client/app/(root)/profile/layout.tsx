import { authOptions } from "@/lib/authOption";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const Header = dynamic(() => import("@/components/website/header/Header"));

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export const metadata: Metadata = {
  title: "Profile",
  description: "...",
};


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
      <div className="w-4/5 mx-auto md:p-10">{children}</div>
      <WebFooter />
    </main>
  );
}
