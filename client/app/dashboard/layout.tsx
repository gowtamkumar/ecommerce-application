"use client";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Layout } from "antd";
import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectLayout } from "@/redux/features/layout/layoutSlice";

const { Content } = Layout;

const FooterOption = dynamic(() => import("@/components/dashboard/Footer"), {
  ssr: false,
});
const BreadCrumb = dynamic(() => import("@/components/dashboard/BreadCrumb"), {
  ssr: false,
});
const Loading = dynamic(() => import("./loading"), { ssr: false });
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
  const layout = useSelector(selectLayout);

  if (session.data?.user?.role !== "Admin") {
    redirect("/");
  }

  // Calculate marginLeft based on sidebar state
  const marginLeft = layout.screenWidth > 820 
    ? (layout.collapsed ? 80 : 260) 
    : 0;

  return (
    <Suspense fallback={<Loading />}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout 
          style={{ 
            marginLeft: `${marginLeft}px`,
            transition: 'margin-left 0.2s',
          }}
        >
          <DashboardHeader />
          <Content 
            style={{ 
              padding: "0 24px",
              minHeight: "calc(100vh - 64px - 70px)", // viewport - header - footer
            }}
          >
            <BreadCrumb />
            <div style={{ padding: "24px 0" }}>
              {children}
            </div>
          </Content>
          <FooterOption />
        </Layout>
      </Layout>
    </Suspense>
  );
}
