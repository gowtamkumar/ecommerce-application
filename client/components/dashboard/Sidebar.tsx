"use client";
import { navbarRoute } from "@/NavBarRoute";
import {
  selectLayout,
  setCollapsed,
  setOpen,
  setScreenWidth,
} from "@/redux/features/layout/layoutSlice";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Drawer, Input, Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderLogo from "../website/header/Logo";

const { Sider } = Layout;

const Sidebar = () => {
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();
  const route = useRouter();

  const [searchTerm, setSearchTerm] = useState("");

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

  const getLabelText = (label: any): string => {
    if (typeof label === 'string') return label;
    if (label?.props?.children) {
      return typeof label.props.children === 'string'
        ? label.props.children
        : getLabelText(label.props.children);
    }
    return '';
  };

  const filteredChildren = navbarRoute
    ?.filter((item: any) => checkPermission(item))
    .map((item: any) => {
      const itemText = getLabelText(item.label);
      const hasMatchingChild = item.children?.some((child: any) =>
        getLabelText(child.label).toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesSearch = itemText.toLowerCase().includes(searchTerm.toLowerCase());

      if (searchTerm && !matchesSearch && !hasMatchingChild) return null;

      return {
        ...item,
        children: item?.children?.filter((child: any) => {
          const childText = getLabelText(child.label);
          // If parent matches, show all kids? Or just matching kids?
          // Usually showing matching kids is better, but if parent matches, maybe show all.
          // Let's stick to strict matching for now: show child if it matches OR if parent matches.
          // Actually, if parent matched (matchesSearch=true), we generally show all children logic often varies.
          // Let's go with: Only show children that match, UNLESS the search term matches the parent strictly, then maybe show all?
          // Let's Keep it simple: Filter children by search term too.
          if (matchesSearch) return checkPermission(child); // If parent matches, return all permitted children
          return checkPermission(child) && childText.toLowerCase().includes(searchTerm.toLowerCase());
        }),
      };
    })
    .filter(Boolean); // Remote nulls from map -> null return

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

        {/* Search Input */}
        {!layout.collapsed && (
          <div className="px-4 py-4">
            <Input
              placeholder="Search menu..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 hover:border-gray-600 focus:border-blue-500"
              style={{
                borderRadius: '8px',
              }}
            />
          </div>
        )}

        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          items={filteredChildren as any}
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
