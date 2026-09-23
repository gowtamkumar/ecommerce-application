'use client'
import { selectLayout } from "@/redux/features/layout/layoutSlice";
import { Layout } from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const { Content } = Layout;

const FooterOption = dynamic(() => import("@/components/dashboard/Footer"), {
  ssr: false,
});
const DashboardHeader = dynamic(() => import("@/components/dashboard/Header"), {
  ssr: false,
});
const Sidebar = dynamic(() => import("@/components/dashboard/Sidebar"), {
  ssr: false,
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: any = useSession();
  const layoutSite = useSelector(selectLayout);

  if (session.data?.user?.role !== "Admin") {
    redirect("/");
  }

  // Calculate marginLeft based on sidebar state
  const isDesktop = typeof window !== "undefined"
    ? window.innerWidth > 820
    : (layoutSite.screenWidth > 820);
  const marginLeft = isDesktop ? (layoutSite.collapsed ? 80 : 260) : 0;

  return (
    <Layout style={{ minHeight: "100vh" }} className="overflow-x-hidden">
      <Sidebar />
      <Layout
        className="transition-all duration-200 min-w-0 max-w-full overflow-x-hidden"
        style={{
          marginLeft: `${marginLeft}px`,
          transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <DashboardHeader />
        <Content className="px-3 sm:px-6 min-h-[calc(100vh-64px-70px)] bg-gray-50/50 max-w-full overflow-x-hidden">
          <div className="py-3 sm:py-6">
            {children}
          </div>
        </Content>
        <FooterOption />
      </Layout>
    </Layout>
  );
}
