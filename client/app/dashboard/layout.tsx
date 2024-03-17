/* eslint-disable @next/next/no-async-client-component */
"use client";
import { Layout, theme } from "antd";
import React, { Suspense, useLayoutEffect, useState } from "react";
import FooterOption from "@/components/dashboard/Footer";
import BreadCrumb from "@/components/dashboard/BreadCrumb";
import DashboardHeader from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import Loading from "../loading";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);

  const router = useRouter();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useLayoutEffect(() => {
    function updateScreenWidth() {
      setScreenWidth(window.innerWidth);
    }
    // Update screen width on mount
    updateScreenWidth();

    // Add event listener to update screen width on resize
    window.addEventListener("resize", updateScreenWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // if (sessions) {
  //   router.push("/");
  // }

  return (
    <Suspense fallback={<Loading />}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar
          setCollapsed={setCollapsed}
          collapsed={collapsed}
          screenWidth={screenWidth}
          onClose={onClose}
          open={open}
        />

        <Layout>
          <DashboardHeader
            screenWidth={screenWidth}
            setCollapsed={setCollapsed}
            collapsed={collapsed}
            showDrawer={showDrawer}
          />
          <Content style={{ margin: "0 15px" }}>
            <BreadCrumb />
            <div
              style={{
                padding: 10,
                minHeight: "80vh",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <FooterOption />
        </Layout>
      </Layout>
    </Suspense>
  );
}
