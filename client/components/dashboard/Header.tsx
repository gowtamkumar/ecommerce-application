import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { theme, Layout, Button, Dropdown, Avatar } from "antd";
import React from "react";
import { profileRoute } from "./NavBarRoute";

export default function DashboardHeader({
  screenWidth,
  setCollapsed,
  collapsed,
  showDrawer,
}: any) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Header } = Layout;

  return (
    <Header
      style={{
        padding: 0,
        margin: 0,
        height: 50,
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* this button show only desktop a  */}

      <Button
        type="text"
        className="hover:bg-none"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        hidden={screenWidth < 820}
        style={{
          fontSize: "16px",
          width: 50,
          height: 50
        }}
      />
      <div className="md:flex gap-2 hidden">
        <Button type="dashed" className="text-cyan-950">ORDER LIST</Button>
        <Button type="dashed" className="text-cyan-950">POS</Button>
        <Button type="dashed" className="text-cyan-950">KITCHEN DASHBOARD</Button>
      </div>

      {/* this button show only Mobile a  */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={showDrawer}
        hidden={screenWidth > 820}
        style={{
          fontSize: "16px",
          width: 50,
          height: 50,
        }}
      />
      <Dropdown
        menu={{ items: profileRoute }}
        placement="bottomLeft"
        trigger={["click"]}
      >
        <Avatar
          className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
          size={35}
          src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
        />
      </Dropdown>
    </Header>
  );
}
