"use client";
import { userProfileRoute } from "@/NavBarRoute";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { Avatar, Badge, Dropdown } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaRegUser, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function HeaderRight() {
  const cart = useSelector(selectCart);
  const session = useSession();
  return (
    <div className="w-2/12 flex justify-between items-center">
       <div className="ml-3 flex ">
        <Link href="/checkout" className="mx-2">
          <Badge size="default" count={cart.carts.length}>
            <FaShoppingCart size={25} title="dd" />
          </Badge>
        </Link>
      </div>
      {session.status === "authenticated" ? (
        <Dropdown
          menu={{ items: userProfileRoute as any }}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <Avatar
            className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
            size={35}
            src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
          />
        </Dropdown>
      ) : (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center justify-between">
            <FaRegUser />{" "}
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
