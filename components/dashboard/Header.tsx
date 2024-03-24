import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { theme, Layout, Button, Dropdown, Avatar, MenuProps } from "antd";
import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLayout,
  setCollapsed,
  setOpen,
} from "@/redux/features/layout/layoutSlice";
import { profileRoute } from "./NavBarRoute";

export default function DashboardHeader() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Header } = Layout;
  // redux hook
  // const layout = useSelector((state: RootState) => state.layout);
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();

 

  return (
    <Header
      style={{
        padding: 0,
        margin: 0,
        height: 50,
        marginRight: 10,
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
        icon={layout.collapsed ? <MenuUnfoldOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <MenuFoldOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        onClick={() => dispatch(setCollapsed(!layout.collapsed))}
        hidden={layout.screenWidth < 820}
        style={{
          fontSize: "16px",
          width: 50,
          height: 50,
        }}
      />
      <div className="md:flex gap-2 hidden">
        <Button type="dashed" size="small" className="text-cyan-950">
          <Link href="/dashboard/orders">ORDER LIST</Link>
        </Button>

        <Button type="dashed" size="small" className="text-cyan-950">
          POS
        </Button>

        <Button type="dashed" size="small" className="text-cyan-950">
          <Link href="/dashboard/kitchen-dashboard"> KITCHEN DASHBOARD</Link>
        </Button>
      </div>

      {/* this button show only Mobile a  */}
      <Button
        type="text"
        icon={layout.collapsed ? <MenuUnfoldOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /> : <MenuFoldOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
        onClick={() => dispatch(setOpen(true))}
        hidden={layout.screenWidth > 820}
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
