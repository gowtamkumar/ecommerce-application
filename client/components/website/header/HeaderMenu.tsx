"use client";
import React, { Suspense, useState } from "react";
import { Menu, MenuProps, Spin } from "antd";
import { webSiteNavbarItems } from "@/NavBarRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeaderMenu({ categories }: any) {
  const [current, setCurrent] = useState("mail");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };
  const router = useRouter();
  // if (!categories.data?.length) {
  //   return <Spin />
  // }

  return (
    <div className="border rounded">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        // color='black'
        theme="light"
        items={categories?.data?.map((item: any, idx: number) => ({
          key: idx,
          label: (
            <div
              key={idx}
              // href={`/category/${item.id}`}
              // rel="noopener noreferrer"
              onClick={() => {
                router.push(`/products?categoryId=${item.id}&`);
              }}
            >
              {item.name}
            </div>
          ),
          children:
            item.children.length &&
            item.children.map((childrenItem: any, idx: number) => ({
              type: "group",
              label: (
                <Link
                  key={idx}
                  href={`/category/${childrenItem.id}`}
                  rel="noopener noreferrer"
                >
                  {childrenItem.name}
                </Link>
              ),
            })),
        }))}
      />
    </div>
  );
}
