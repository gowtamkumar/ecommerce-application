"use client";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Layout, theme } from "antd";
import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { Metadata } from "next";
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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const session: any = useSession();

  if (session.data.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <Suspense fallback={<Loading />}>
      <div
        style={{
          padding: 10,
          minHeight: "80vh",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar />
          <Layout>
            <DashboardHeader />
            <Content style={{ margin: "0 15px" }}>
              <BreadCrumb />
              {children}
            </Content>
            <FooterOption />
          </Layout>
        </Layout>
      </div>
    </Suspense>
  );
}
