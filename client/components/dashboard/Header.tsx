import { AiOutlineMenuUnfold } from "react-icons/ai";
import { theme, Layout, Button, Dropdown, Avatar } from "antd";
import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLayout,
  setCollapsed,
  setOpen,
} from "@/redux/features/layout/layoutSlice";
import { userProfileRoute } from "@/NavBarRoute";
import { useSession } from "next-auth/react";

export default function DashboardHeader() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { Header } = Layout;
  // redux hook
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();
  const session = useSession();
  const profileImage = session.data?.user.image;

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

      <div hidden={layout.screenWidth < 820}>
        <Button
          type="text"
          className="hover:bg-none"
          icon={
            layout.collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuUnfold />
          }
          onClick={() => dispatch(setCollapsed(!layout.collapsed))}
          style={{
            fontSize: "16px",
            width: 50,
            height: 50,
          }}
        />
      </div>

      <div className="md:flex gap-2 hidden">
        <Button type="dashed" size="small" className="text-cyan-950">
          <Link href="/dashboard/orders">ORDER LIST</Link>
        </Button>
      </div>

      {/* this button show only Mobile a  */}
      <div hidden={layout.screenWidth > 820}>
        <Button
          type="text"
          icon={
            layout?.collapsed ? (
              <AiOutlineMenuUnfold />
            ) : (
              <AiOutlineMenuUnfold />
            )
          }
          onClick={() => dispatch(setOpen(true))}
          style={{
            fontSize: "16px",
            width: 50,
            height: 50,
          }}
        />
      </div>

      <Dropdown
        menu={{ items: userProfileRoute as any }}
        placement="bottomLeft"
        trigger={["click"]}
      >
        <Avatar
          className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
          size={35}
          src={
            profileImage
              ? `http://localhost:3900/uploads/${profileImage}`
              : "/pos_software.png"
          }
        />
      </Dropdown>
    </Header>
  );
}
