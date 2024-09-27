"use client";
import { userProfileRoute } from "@/NavBarRoute";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { Avatar, Badge, Dropdown, Modal } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CiSearch, CiHeart } from "react-icons/ci";

import { IoBagOutline } from "react-icons/io5";
import HeaderSearch from "./HeaderSearch";

export default function HeaderRight({res}: any) {
  const [open, setOpen] = useState(false);
  // const cart = useSelector(selectCart);
  const session = useSession();
  const profileImage = session.data?.user.image;

  // console.log("cart.carts", cart.carts);
  

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
      <Link href="/checkout" className="cursor-pointer mt-1 md:inline hidden">
        <Badge size="default" count={res.data?.length}>
          <IoBagOutline size={22} className="font-medium" />
        </Badge>
      </Link>
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
                ? `http://localhost:3900/uploads/${profileImage}`
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
