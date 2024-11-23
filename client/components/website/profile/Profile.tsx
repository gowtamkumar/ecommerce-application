"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
// redux
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
// api
import { getMe } from "@/lib/apis/user";

const UserOrders = dynamic(
  () => import("@/components/website/profile/UserOrders"),
  {
    ssr: false,
  }
);

const MyAccount = dynamic(
  () => import("@/components/website/profile/MyAccount"),
  {
    ssr: false,
  }
);

const MyWishlist = dynamic(
  () => import("@/components/website/profile/MyWishlist"),
  {
    ssr: false,
  }
);
const MyShippingAddress = dynamic(() => import("./MyShippingAddress"), {
  ssr: false,
});
const OrderTracker = dynamic(() => import("./OrderTracker"), {
  ssr: false,
});

export default function Profile() {
  const [user, setUser] = useState({} as any);
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
          key: "orders",
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
          children: <OrderTracker orders={user?.orders} />,
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
