"use client";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoReorderFour } from "react-icons/io5";
import { MdLocalShipping, MdOutlineSpatialTracking } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { SiWish } from "react-icons/si";
import { useSelector } from "react-redux";
import "./notification.css";
import NotificationsUser from "./NotificationsUser";
import ChangePassword from "./PasswordChange";

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
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();

  useEffect(() => {
    setTabKey(categoryIdParams ?? "my_account");
  }, [categoryIdParams]);

  const menuItems = [
    {
      key: "my_account",
      label: "My Account",
      icon: <RiAccountCircleLine size={22} />,
      component: <MyAccount />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <IoReorderFour size={22} />,
      component: <UserOrders />,
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: <SiWish size={20} />,
      component: <MyWishlist />,
    },
    {
      key: "shipping_address",
      label: "Shipping Address",
      icon: <MdLocalShipping size={22} />,
      component: <MyShippingAddress />,
    },
    {
      key: "track_order",
      label: "Track Order",
      icon: <MdOutlineSpatialTracking size={22} />,
      component: <OrderTracker />,
    },
    {
      key: "notification",
      label: "Notifications",
      icon: <IoIosNotifications size={22} />,
      component: <NotificationsUser />,
    },
    {
      key: "change_password",
      label: "Change Password",
      icon: <IoIosNotifications size={22} />, // Note: Using same icon as original, consider changing if needed
      component: <ChangePassword />,
    },
  ];

  const activeComponent = menuItems.find((item) => item.key === tabKey)?.component;

  const handleTabChange = (key: string) => {
    route.replace(`/profile?tab=${key}`, { scroll: false });
    setTabKey(key);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-3xl font-bold font-global-primary-fontfamily mb-8 text-gray-900">My Profile</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
                    {/* Ideally User Initials here */}
                    <RiAccountCircleLine size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Welcome back</p>
                    <p className="font-bold text-gray-900">User Dashboard</p>
                  </div>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${tabKey === item.key
                      ? "bg-black text-white shadow-md"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <span className={`${tabKey === item.key ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
                      {item.icon}
                    </span>
                    <span className={`${tabKey === item.key ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px] animate-fade-in">
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
