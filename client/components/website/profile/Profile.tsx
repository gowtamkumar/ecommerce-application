"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
// redux
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/features/global/globalSlice";
// api
import { getMe } from "@/lib/apis/user";
import NotificationsUser from "./NotificationsUser";
import { useRouter, useSearchParams } from "next/navigation";

const ProfileDashboard = dynamic(() => import("./ProfileDashboard"), {
  ssr: false,
});

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

const MyShippingAddress = dynamic(
  () => import("./shipping-address/ShippingAddressList"),
  {
    ssr: false,
  }
);
const OrderTracker = dynamic(() => import("./OrderTracker"), {
  ssr: false,
});

export default function Profile() {
  const [user, setUser] = useState({} as any);
  const [tabKey, setTabKey] = useState("my_account");
  // hook
  const dispatch = useDispatch();
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();

  useEffect(() => {
    feathUser();
  }, [dispatch]);

  const feathUser = async () => {
    const res = await getMe();
    setUser(res.data);
  };

  useEffect(() => {
    setTabKey(categoryIdParams ?? "my_account");
  }, [categoryIdParams]);

  return (
    <Tabs
      onChange={
        (key) =>
          route.replace(
            `/profile?tab=${key}`,
            { scroll: false }
            // { shallow: true }
          )
        //  setTabKey(key)
      }
      defaultValue={tabKey}
      activeKey={tabKey}
      tabPosition="left"
      items={[
        {
          label: `Dashboard`,
          key: "dashboard",
          children: <ProfileDashboard />,
          icon: <AppleOutlined />,
        },
        {
          label: `My Account`,
          key: "my_account",
          children: <MyAccount user={user} />,
          icon: <AppleOutlined />,
        },

        {
          label: `Orders`,
          key: "orders",
          children: <UserOrders status="Pending" />,
          icon: <AndroidOutlined />,
        },
        {
          label: `Wishlist`,
          key: "wishlist",
          children: <MyWishlist />,
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
          key: "track_order",
          children: <OrderTracker />,
          icon: <AndroidOutlined />,
        },

        {
          label: `Notifications`,
          key: "notification",
          children: <NotificationsUser />,
          icon: <AndroidOutlined />,
        },
        {
          label: `My Returns & Cancellations`,
          key: "my_Returns_cancellations",
          children: <UserOrders status="Canceled" />,
          icon: <AndroidOutlined />,
        },

        // {
        //   label: `My Point`,
        //   children: `My Point`,
        //   key: "point",
        //   icon: <AndroidOutlined />,
        // },
      ]}
    />
  );
}
