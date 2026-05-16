"use client";
import { getUserOrders } from "@/lib/apis/orders";
import { getUserWishlists } from "@/lib/apis/wishlist";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
  BellOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
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
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, spending: 0 });
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();
  const { data: session } = useSession();

  const userImage = session?.user?.image;

  useEffect(() => {
    setTabKey(categoryIdParams ?? "my_account");
  }, [categoryIdParams]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          getUserOrders(""),
          getUserWishlists()
        ]);

        const orders = ordersRes.data || [];
        const wishlist = wishlistRes.data || [];
        const totalSpending = orders
          .filter((o: any) => o.status === "Delivered")
          .reduce((acc: number, o: any) => acc + (Number(o.grandTotal) - Number(o.totalReturned)), 0);

        setStats({
          orders: orders.length,
          wishlist: wishlist.length,
          spending: totalSpending
        });
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      }
    };
    if (session) fetchStats();
  }, [session]);

  const menuItems = [
    {
      key: "my_account",
      label: "My Account",
      icon: <UserOutlined />,
      component: <MyAccount />,
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <ShoppingOutlined />,
      component: <UserOrders />,
    },
    {
      key: "wishlist",
      label: "My Wishlist",
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
      icon: <ClockCircleOutlined />,
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
      label: "Security",
      icon: <KeyOutlined />,
      component: <ChangePassword />,
    },
  ];

  const activeComponent = menuItems.find((item) => item.key === tabKey)?.component;

  const handleTabChange = (key: string) => {
    route.replace(`/profile?tab=${key}`, { scroll: false });
    setTabKey(key);
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all duration-300">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl transition-colors ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg sm:text-xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1 sm:mb-2">Account Dashboard</h1>
              <p className="text-gray-500 text-sm sm:text-base flex items-center gap-2">
                Welcome back, <span className="font-bold text-gray-900">{session?.user?.name}</span> 👋
              </p>
            </div>
            {/* <button 
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors w-full sm:w-auto justify-center"
            >
              <LogoutOutlined /> Sign Out
            </button> */}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatCard
            icon={<ShoppingOutlined />}
            label="Total Orders"
            value={stats.orders}
            color="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          />
          <StatCard
            icon={<HeartOutlined />}
            label="Wishlist Items"
            value={stats.wishlist}
            color="bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
          />
          <StatCard
            icon={<CreditCardOutlined />}
            label="Total Spent"
            value={`$${stats.spending.toLocaleString()}`}
            color="bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">

          {/* Sidebar / Mobile Nav */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4 sm:space-y-6">

              {/* Profile Card - More compact on mobile */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm group">
                <div className="h-16 sm:h-24 w-full relative">
                  <Image
                    src="/images/profile_hero_bg.png"
                    alt="bg"
                    fill
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white"></div>
                </div>

                <div className="px-4 pb-4 sm:px-6 sm:pb-8 -mt-8 sm:-mt-10 relative z-10 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gray-50 mb-2 sm:mb-4">
                    <Image
                      src={getImageUrl(userImage)}
                      alt={session?.user?.name || "User"}
                      width={80}
                      height={80}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight mb-0.5 sm:mb-1">{session?.user?.name}</h3>
                  <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">{session?.user?.email}</p>
                </div>
              </div>

              {/* Navigation Menu - Horizontal Scroll on Mobile */}
              <nav className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-2 sm:p-3">
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 sm:gap-1.5 scrollbar-hide no-scrollbar">
                  {menuItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleTabChange(item.key)}
                      className={`flex-shrink-0 lg:w-full flex items-center gap-2 sm:gap-4 px-4 py-2.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${tabKey === item.key
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200 lg:translate-x-1"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      <span className="text-base sm:text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </nav>

            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            <div className="bg-white rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-gray-100 p-5 sm:p-8 md:p-12 min-h-[400px] sm:min-h-[600px] relative overflow-hidden">
              {/* Decorative Circle - Hidden on smallest mobile */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl hidden sm:block"></div>

              <div className="relative z-10">
                <header className="mb-6 sm:mb-10">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-900 text-white flex items-center justify-center text-sm sm:text-lg">
                      {menuItems.find(i => i.key === tabKey)?.icon}
                    </span>
                    {menuItems.find(i => i.key === tabKey)?.label}
                  </h2>
                </header>

                {/* Content with smoother animation */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-x-auto sm:overflow-visible">
                  {activeComponent}
                </div>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
