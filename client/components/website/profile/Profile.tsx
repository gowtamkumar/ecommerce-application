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
import MyShippingAddress from "./MyShippingAddress";
import OrderTracker from "./OrderTracker";

export default function Profile() {
  const [user, setUser] = useState({} as any);
  console.log("🚀 ~ user:", user);
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
    <Tabs
      onChange={(key) => setTabKey(key)}
      defaultValue={tabKey}
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
          children: (
            <UserOrders
              orders={(user?.orders || []).filter(
                (item: { status: string }) => item.status !== "Returned"
              )}
            />
          ),
          icon: <AndroidOutlined />,
        },
        {
          label: `Wishlist`,
          key: "wishlist",
          children: <MyWishlist wishlists={user?.wishlists} />,
          icon: <AndroidOutlined />,
        },

        {
          label: `Shipping Address`,
          key: "shipping_address",
          children: (
            <MyShippingAddress shippingAddress={user?.shippingAddress} />
          ),
          icon: <AndroidOutlined />,
        },
        {
          label: `Track your Order`,
          key: "track_your_order",
          children: <OrderTracker />,
          icon: <AndroidOutlined />,
        },

        {
          label: `My Returns & Cancellations`,
          key: "my_Returns_cancellations",
          children: (
            <UserOrders
              orders={(user?.orders || []).filter(
                (item: { status: string }) =>
                  item.status === "Returned" || item.status === "Canceled"
              )}
            />
          ),
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
  );
}
