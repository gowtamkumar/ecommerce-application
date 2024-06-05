"use client";
import React, { Children, useState } from "react";
import { Menu, MenuProps } from "antd";
import { webSiteNavbarItems } from "@/NavBarRoute";
import Item from "antd/es/list/Item";

export default function Sidebar({ categories }: any) {
  console.log("🚀 ~ categories:", categories);
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    // console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div className="border rounded">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="vertical"
        items={webSiteNavbarItems}
        // items={categories.map((item: any, idx: number) => ({
        //   ...item,
        //   key: idx,
        //   label: item.name,
        //   children:
        //     item.children.length &&
        //     item.children.map((childrenItem: any, idx: number) => ({
        //       ...childrenItem,
        //       type: "group",
        //       label: (
        //         <a
        //           key={idx}
        //           href={`category/${childrenItem.id}`}
        //           target="_blank"
        //           rel="noopener noreferrer"
        //         >
        //           {childrenItem.name}
        //         </a>
        //       ),
        //     })),
        // }))}
      />
    </div>
  );
}
