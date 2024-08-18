"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import UserOrders from "@/components/website/profile/UserOrders";
import MyAccount from "@/components/website/profile/MyAccount";
import { getMe } from "@/lib/apis/user";
import MyWishlist from "@/components/website/profile/MyWishlist";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";

export default function Profile() {
  const [user, setUser] = useState({});
  const [tabKey, setTabKey] = useState("my_account");
  // hook
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getMe();
      setUser(res.data);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  return (
    <div>
      <Tabs
        tabPosition="left"
        defaultActiveKey="1"
        onChange={(key) => setTabKey(key)}
        type="card"
        items={[
          {
            label: `My Account`,
            key: "my_account",
            children: <MyAccount user={user} />,
            icon: <AppleOutlined />,
          },

          {
            label: `Orders`,
            key: "Orders",
            children: <UserOrders />,
            icon: <AndroidOutlined />,
          },
          {
            label: `Wishlist`,
            key: "wishlist",
            children: <MyWishlist user={user} />,
            icon: <AndroidOutlined />,
          },

          {
            label: `Shipping Address`,
            key: "shipping_address",
            children: "shipping address",
            icon: <AndroidOutlined />,
          },

          {
            label: `My Returns & Cancellations`,
            key: "my_Returns_cancellations",
            children: `My Returns & Cancellations`,
            icon: <AndroidOutlined />,
          },

          {
            label: `My Point`,
            children: `My Point`,
            key: "point",
            icon: <AndroidOutlined />,
          },
        ]}
      />
    </div>
  );
}
