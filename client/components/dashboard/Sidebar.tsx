"use client";
import { navbarRoute } from "@/NavBarRoute";
import {
  selectLayout,
  setCollapsed,
  setOpen,
  setScreenWidth,
} from "@/redux/features/layout/layoutSlice";
import { CloseOutlined } from "@ant-design/icons";
import { Drawer, Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderLogo from "../website/header/Logo";

const { Sider } = Layout;

const Sidebar = () => {
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();
  const route = useRouter();

  useLayoutEffect(() => {
    function updateScreenWidth() {
      dispatch(setScreenWidth(window.innerWidth));
    }
    // Update screen width on mount
    updateScreenWidth();

    // Add event listener to update screen width on resize
    window.addEventListener("resize", updateScreenWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateScreenWidth);
    };
  }, [dispatch]);

  const onClose = () => {
    dispatch(setOpen(false));
  };

  const checkPermission = (item: any) => {
    const isAdmin = true;
    if (isAdmin) return true;
    let access = false;
    if (item.route === "true") {
      access = true;
    }
    return access;
  };

  const filteredChildren = navbarRoute
    ?.filter((item: any) => checkPermission(item))
    .map((item: any) => ({
      ...item,
      children: item?.children?.filter((child: any) => checkPermission(child)),
    }));

  return (
    <div className="bg-[#001529]">
      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={onClose}
        open={layout.open}
        styles={{
          body: { margin: 0, padding: 0 },
          header: {
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px'
          }
        }}
        width={280}
        closeIcon={<CloseOutlined />}
        title={
          <div
            className="cursor-pointer flex items-center"
            onClick={() => {
              route.push("/");
              onClose();
            }}
          >
            <HeaderLogo />
          </div>
        }
      >
        <Menu
          style={{
            margin: 0,
            padding: 0,
            border: 'none'
          }}
          theme="light"
          mode="inline"
          onClick={onClose}
          items={filteredChildren as any}
          className="sidebar-menu"
        />
      </Drawer>

      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={layout.collapsed}
        onCollapse={(value) => dispatch(setCollapsed(value))}
        hidden={layout.screenWidth <= 820}
        width={260}
        collapsedWidth={80}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
        theme="dark"
      >
        {/* Logo Section */}
        <div
          className={`bg-white flex justify-center items-center cursor-pointer transition-all duration-300 ${layout.collapsed ? "p-2 h-16" : "p-3 h-20"
            }`}
          onClick={() => {
            route.push("/");
          }}
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <HeaderLogo />
        </div>

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          items={filteredChildren}
          className="sidebar-menu-dark"
          style={{
            borderRight: 0,
            fontSize: '14px',
          }}
        />
      </Sider>
    </div>
  );
};

export default Sidebar;
