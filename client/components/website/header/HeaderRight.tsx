"use client";
import { userProfileRoute } from "@/NavBarRoute";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { Avatar, Badge, Dropdown } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { CiSearch, CiUser, CiHeart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";

export default function HeaderRight() {
  const cart = useSelector(selectCart);
  const session = useSession();
  const profileImage = session.data?.user.image;
  return (
    <div className="flex gap-4 justify-between items-center">
      <CiSearch size={22} className="font-medium" />
      {/* <CiUser size={22} className="font-medium" /> */}
      <CiHeart size={22} className="font-medium" />
      <Badge size="default" count={cart.carts.length}>
        <IoBagOutline size={22} className="font-medium" />
      </Badge>
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
    </div>
  );
}
