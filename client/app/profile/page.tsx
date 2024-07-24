import React from "react";
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import Orders from "@/components/website/profile/Orders";
import MyAccount from "@/components/website/profile/MyAccount";
import { getMe } from "@/lib/apis/user";
import MyWishlist from "@/components/website/profile/MyWishlist";

export default async function Profile() {
  const user = await getMe();

  return (
    <div>
      <Tabs
        tabPosition="left"
        defaultActiveKey="1"
        items={[
          {
            label: `My Account`,
            children: <MyAccount user={user.data} />,
            icon: <AppleOutlined />,
          },

          {
            label: `Orders`,
            children: <Orders />,
            icon: <AndroidOutlined />,
          },
          {
            label: `Wishlist`,
            children: <MyWishlist user={user.data} />,
            icon: <AndroidOutlined />,
          },
          {
            label: `Rating and Review`,
            children: `My Rating and Review`,
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
  );
}
