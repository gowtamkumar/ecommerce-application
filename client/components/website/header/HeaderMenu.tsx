"use client";
import React, { useState } from "react";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

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
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      // style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="horizontal"
      // color='black'
      // theme="dark"
    
      items={categories?.data?.map((item: any, idx: number) => ({
        key: idx,
        label: (
          <div
            key={idx}
            onClick={() => {
              router.push(`/products?categoryId=${item.id}&`);
            }}
          >
            {item.name}
          </div>
        ),

        // icon: item.children.length ? <AppstoreOutlined /> : null,
        children:
          item.children.length &&
          item.children.map((childrenItem: any, idx: number) => ({
            type: "group",
            label: (
              <div
                className="cursor-pointer"
                key={idx}
                // href={`/category/${childrenItem.id}`}
                onClick={() => {
                  router.push(`/products?categoryId=${childrenItem.id}&`);
                }}
              >
                {childrenItem.name}
              </div>
            ),
          })),
      }))}
    />
  );
}
