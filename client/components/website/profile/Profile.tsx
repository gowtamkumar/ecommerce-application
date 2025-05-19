"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Tabs } from "antd";
// api
import NotificationsUser from "./NotificationsUser";
import { useRouter, useSearchParams } from "next/navigation";
import "./notification.css";
import { useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { RiAccountCircleLine } from "react-icons/ri";
import { IoReorderFour } from "react-icons/io5";
import { SiWish } from "react-icons/si";
import { MdLocalShipping, MdOutlineSpatialTracking } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

// const ProfileDashboard = dynamic(() => import("./ProfileDashboard"), {
//   ssr: false,
// });

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
  const [tabKey, setTabKey] = useState("my_account");
  const global = useSelector(selectGlobal);
  // hook
  // const dispatch = useDispatch();
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();

  useEffect(() => {
    setTabKey(categoryIdParams ?? "my_account");
  }, [categoryIdParams]);

  return (
    <Tabs
      onChange={(key) =>
        route.replace(`/profile?tab=${key}`, { scroll: false })
      }
      defaultValue={tabKey}
      activeKey={tabKey}
      tabPosition={global.mobile ? "top" : "left"}
      items={[
        {
          label: (
            <span className="flex items-center gap-2">
              <RiAccountCircleLine size={20} />
              My Account
            </span>
          ),
          key: "my_account",
          children: <MyAccount />,
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <IoReorderFour size={20} />
              Orders
            </span>
          ),
          key: "orders",
          children: <UserOrders />,
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <SiWish size={20} />
              Wishlist
            </span>
          ),
          key: "wishlist",
          children: <MyWishlist />,
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <MdLocalShipping size={20} />
              Shipping Address
            </span>
          ),
          key: "shipping_address",
          children: <MyShippingAddress />,
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <MdOutlineSpatialTracking size={20} />
              Track your Order
            </span>
          ),
          key: "track_order",
          children: <OrderTracker />,
        },
        {
          label: (
            <span className="flex items-center gap-2">
              <IoIosNotifications size={20} />
              Notifications
            </span>
          ),
          key: "notification",
          children: <NotificationsUser />,
        },
      ]}
    />
  );
}
