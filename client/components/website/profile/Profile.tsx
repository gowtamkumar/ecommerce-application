"use client";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
  BellOutlined,
  EnvironmentFilled,
  EnvironmentOutlined,
  HeartOutlined,
  KeyOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./notification.css";
import NotificationsUser from "./NotificationsUser";
import ChangePassword from "./PasswordChange";

const UserOrders = dynamic(
  () => import("@/components/website/profile/UserOrders"),
  { ssr: false }
);

const MyAccount = dynamic(
  () => import("@/components/website/profile/MyAccount"),
  { ssr: false }
);

const MyWishlist = dynamic(
  () => import("@/components/website/profile/MyWishlist"),
  { ssr: false }
);

const MyShippingAddress = dynamic(
  () => import("./shipping-address/ShippingAddressList"),
  { ssr: false }
);
const OrderTracker = dynamic(() => import("./OrderTracker"), {
  ssr: false,
});

export default function Profile() {
  const [tabKey, setTabKey] = useState("my_account");
  const global = useSelector(selectGlobal);
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();

  const session = useSession();

  const userImage = session.data?.user.image;

  console.log("session", userImage);


  useEffect(() => {
    setTabKey(categoryIdParams ?? "my_account");
  }, [categoryIdParams]);

  const menuItems = [
    {
      key: "my_account",
      label: "My Account",
      icon: <UserOutlined />,
      component: <MyAccount />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingOutlined />,
      component: <UserOrders />,
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: <HeartOutlined />,
      component: <MyWishlist />,
    },
    {
      key: "shipping_address",
      label: "Shipping Address",
      icon: <EnvironmentOutlined />,
      component: <MyShippingAddress />,
    },
    {
      key: "track_order",
      label: "Track Order",
      icon: <EnvironmentFilled />, // Or Antd equivalent
      component: <OrderTracker />,
    },
    {
      key: "notification",
      label: "Notifications",
      icon: <BellOutlined />,
      component: <NotificationsUser />,
    },
    {
      key: "change_password",
      label: "Change Password",
      icon: <KeyOutlined />,
      component: <ChangePassword />,
    },
  ];

  const activeComponent = menuItems.find((item) => item.key === tabKey)?.component;

  const handleTabChange = (key: string) => {
    route.replace(`/profile?tab=${key}`, { scroll: false });
    setTabKey(key);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 lg:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {/* Header - Mobile Only / Breadcrumb style */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar / Mobile Horizontal Menu */}
          <div className="w-full lg:w-72 flex-shrink-0">

            {/* Sticky Wrapper */}
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* User Summary Card (Desktop) */}
              <div className="hidden lg:block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4">
                  <Image
                    src={getImageUrl(userImage)}
                    alt={session.data?.user.name}
                    width={100}
                    height={100}
                    className="rounded-full h-20 w-20"

                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{session.data?.user.name}</h3>
                <p className="text-gray-500 text-sm">Manage your personal info</p>
              </div>

              {/* Navigation Menu */}
              <div className="bg-white lg:rounded-2xl lg:border lg:border-gray-100 lg:shadow-sm overflow-hidden lg:p-2">
                {/* Mobile: Horizontal Scroll */}
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
                  {menuItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleTabChange(item.key)}
                      className={`
                                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                                ${tabKey === item.key
                          ? "bg-black text-white shadow-md lg:w-full"
                          : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 lg:w-full border border-gray-100 lg:border-transparent"}
                            `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Desktop Title */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {menuItems.find(i => i.key === tabKey)?.label || 'Profile'}
              </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px] animate-fade-in relative">
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
