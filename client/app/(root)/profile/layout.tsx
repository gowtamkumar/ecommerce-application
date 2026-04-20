import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "...",
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

  return (
    <main>
      <div className="w-4/5 mx-auto md:p-10">{children}</div>
    </main>
  );
}
