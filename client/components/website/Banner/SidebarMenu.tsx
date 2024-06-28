"use client";
import React, { Suspense, useState } from "react";
import { Menu, MenuProps, Spin } from "antd";
import { webSiteNavbarItems } from "@/NavBarRoute";

export default function SidebarMenu({ categories }: any) {
  const [current, setCurrent] = useState("mail");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  if (!categories.data?.length) {
    return <Spin />;
  }

  return (
    <div className="border rounded">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="vertical"
        // items={webSiteNavbarItems}
        items={categories.data?.map((item: any, idx: number) => ({
          key: idx,
          label: item.name,
          children:
            item.children.length &&
            item.children.map((childrenItem: any, idx: number) => ({
              // ...childrenItem,
              type: "group",
              label: (
                <a
                  key={idx}
                  href={`category/${childrenItem.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {childrenItem.name}
                </a>
              ),
            })),
        }))}
      />
    </div>
  );
}
