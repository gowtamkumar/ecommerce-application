"use client";
import { userProfileRoute } from "@/NavBarRoute";
import { Avatar, Badge, Dropdown, Modal } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { CiSearch, CiHeart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import HeaderSearch from "./HeaderSearch";
import appConfig from "@/appConfig";
import ViewCart from "./ViewCart";
import { FiShoppingBag, FiUser } from "react-icons/fi";

export default function HeaderRight() {
  const [open, setOpen] = useState(false);
  const session = useSession();
  const profileImage = session.data?.user?.image;

  return (
    <div className="flex md:gap-4 gap-1 justify-between items-center order-3 px-2">
      <CiSearch
        size={22}
        className="font-medium cursor-pointer "
        onClick={() => setOpen(true)}
      />
      <Link href="/profile" className="cursor-pointer md:inline hidden">
        <CiHeart size={22} className="font-medium" />
      </Link>

      <div className="relative group">
        <Badge
          size="default"
          count={0}
          className="px-4  font-semibold text-white rounded-md cursor-pointer"
        >
          <FiShoppingBag size={22} className="font-medium" />
        </Badge>

        <ViewCart />
      </div>

      {session.status === "authenticated" ? (
        <Dropdown
          menu={{ items: userProfileRoute as any }}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <Avatar
            className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
            size={25}
            src={
              profileImage
                ? `${appConfig.apiUrl}/uploads/${profileImage}`
                : "/pos_software.png"
            }
          />
        </Dropdown>
      ) : (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center justify-between">
            <Link className="mx-2" href="/login">
              <span className="text-sm">Login</span>
            </Link>{" "}
            |{" "}
            <Link className="mx-2" href="/register">
              <span className="text-sm">Sign up</span>
            </Link>
          </div>
        </div>
      )}

      <Modal
        // title="Search Something"
        // centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={null}
      >
        <HeaderSearch setOpen={setOpen} />
      </Modal>
    </div>
  );
}
