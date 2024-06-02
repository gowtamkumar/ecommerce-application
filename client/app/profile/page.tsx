import React from "react";
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import { AiOutlineMenuUnfold } from "react-icons/ai";

export default function Profile() {
  return (
    <div className="container">
      <div className="md:w-2/3 mx-auto py-16">
        <Tabs
          tabPosition="left"
          defaultActiveKey="2"
          items={[
            {
              label: `Dashboard`,
              children: `Dashboard`,
              icon: <AppleOutlined />,
            },
            {
              label: `Account Details`,
              children: `Account Details and update account details`,
              icon: <AppleOutlined />,
            },
            {
              label: `Orders`,
              children: `List of orders`,
              icon: <AndroidOutlined />,
            },
            {
              label: `Track your order`,
              children: `Track your order`,
              icon: <AndroidOutlined />,
            },
            {
              label: `Passwrod`,
              children: `update password`,
              icon: <AndroidOutlined />,
            },
          ].map((item: any, i) => {
            const id = String(i + 1);
            // console.log("dd", item);

            return {
              key: id,
              label: item.label,
              children: item.children,
              icon: item.icon,
            };
          })}
        />
      </div>
    </div>
  );
}
