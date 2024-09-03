"use client";
import React, { useState } from "react";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function HeaderMenu() {
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
    <div className="flex items-center gap-4">
      {menu.map((item, idx) => (
        <div key={idx} className="font-mono">
          <Link href={item.url}>{item.label}</Link>
        </div>
      ))}
    </div>
  );
}
