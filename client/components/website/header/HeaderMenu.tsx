"use client";
import React, { useState } from "react";
import { Badge, Menu, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiHeart, CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { useSelector } from "react-redux";
export default function HeaderMenu() {
  const cart = useSelector(selectCart);
  // const [current, setCurrent] = useState("mail");

  // const onClick: MenuProps["onClick"] = (e) => {
  //   setCurrent(e.key);
  // };
  // const router = useRouter();
  // if (!categories.data?.length) {
  //   return <Spin />
  // }
  const menu = [
    { key: "home", label: "Home", url: "/" },
    { key: "shop", label: "Shop", url: "/products" },
    { key: "product", label: "Product", url: "/products" },
    { key: "about", label: "About", url: "/about" },
    { key: "contact", label: "Contact", url: "/contact" },
    { key: "blog", label: "Blog", url: "/blog" },
  ];

  return (
    <div className="md:flex  text-center items-center gap-4 lg:text-lg text-2xl justify-center">
      {/* <Menu mode="horizontal" items={menu} /> */}
      {menu.map((item, idx) => (
        <div key={idx} className="font-mono">
          <Link href={item.url}>{item.label}</Link>
        </div>
      ))}

      <div className="font-mono">
        <Link href="/profile" className="cursor-pointer md:hidden inline ">
          <Badge size="default">
            <CiHeart className="font-medium lg:text-lg text-2xl" />
          </Badge>
        </Link>
      </div>

      <Link href="/checkout" className="mt-1 md:hidden inline">
        <Badge size="default" count={cart.carts.length}>
          <IoBagOutline className="font-medium lg:text-lg text-2xl" />
        </Badge>
      </Link>
    </div>
  );
}
