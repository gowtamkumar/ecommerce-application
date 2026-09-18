"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { getUserOrders } from "@/lib/apis/orders";
import { getUserWishlists } from "@/lib/apis/wishlist";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
    BellOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    HeartOutlined,
    KeyOutlined,
    ShoppingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiCreditCard, FiHeart, FiShoppingBag } from "react-icons/fi";
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

const OrderTracker = dynamic(() => import("./OrderTracker"), { ssr: false });

export default function Profile() {
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, spending: 0 });
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();

  const tabKey = categoryIdParams ?? "my_account";
  const userImage = session?.user?.image;
  const userName = session?.user?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          getUserOrders(""),
          getUserWishlists(),
        ]);
        const orders = ordersRes.data || [];
        const wishlist = wishlistRes.data || [];
        const totalSpending = orders
          .filter((o: any) => o.status === "Delivered")
          .reduce(
            (acc: number, o: any) =>
              acc + (Number(o.grandTotal) - Number(o.totalReturned)),
            0
          );
        setStats({ orders: orders.length, wishlist: wishlist.length, spending: totalSpending });
      } catch (err) {
        console.error("Failed to fetch profile stats", err);
      }
    };
    if (session) fetchStats();
  }, [session]);

  const menuItems = [
    { key: "my_account", label: "My Account", icon: <UserOutlined />, component: <MyAccount /> },
    { key: "orders", label: "My Orders", icon: <ShoppingOutlined />, count: stats.orders, component: <UserOrders /> },
    { key: "wishlist", label: "My Wishlist", icon: <HeartOutlined />, count: stats.wishlist, component: <MyWishlist /> },
    { key: "shipping_address", label: "Shipping Address", icon: <EnvironmentOutlined />, component: <MyShippingAddress /> },
    { key: "track_order", label: "Track Order", icon: <ClockCircleOutlined />, component: <OrderTracker /> },
    { key: "notification", label: "Notifications", icon: <BellOutlined />, component: <NotificationsUser /> },
    { key: "change_password", label: "Security", icon: <KeyOutlined />, component: <ChangePassword /> },
  ];

  const activeItem = menuItems.find((i) => i.key === tabKey);

  const handleTabChange = (key: string) => {
    route.replace(`/profile?tab=${key}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Amber accent top line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-global-primary via-amber-300 to-global-primary" />

        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden ring-4 ring-global-primary/40">
                {userImage ? (
                  <Image
                    src={getImageUrl(userImage)}
                    alt={userName}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-global-primary text-white text-2xl sm:text-3xl font-black">
                    {userInitial}
                  </div>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900" />
            </div>

            {/* User info + stat chips */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
                Member Account
              </p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-0.5">
                {userName}
              </h1>
              <p className="text-white/60 text-xs sm:text-sm font-medium mb-5 sm:mb-6">
                {session?.user?.email}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <button
                  onClick={() => handleTabChange("orders")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 sm:px-4 py-2 cursor-pointer transition-all duration-200"
                >
                  <FiShoppingBag className="text-global-primary text-sm shrink-0" />
                  <div className="text-left">
                    <p className="text-white font-black text-sm sm:text-base leading-none">{stats.orders}</p>
                    <p className="text-white/50 text-[9px] font-semibold uppercase tracking-wider leading-none mt-0.5">Orders</p>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("wishlist")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 sm:px-4 py-2 cursor-pointer transition-all duration-200"
                >
                  <FiHeart className="text-rose-400 text-sm shrink-0" />
                  <div className="text-left">
                    <p className="text-white font-black text-sm sm:text-base leading-none">{stats.wishlist}</p>
                    <p className="text-white/50 text-[9px] font-semibold uppercase tracking-wider leading-none mt-0.5">Wishlist</p>
                  </div>
                </button>

                <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-3 sm:px-4 py-2">
                  <FiCreditCard className="text-green-400 text-sm shrink-0" />
                  <div className="text-left">
                    <p className="text-white font-black text-sm sm:text-base leading-none">{formatPrice(stats.spending)}</p>
                    <p className="text-white/50 text-[9px] font-semibold uppercase tracking-wider leading-none mt-0.5">Total Spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">

          {/* Sidebar — Nav Only */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 no-scrollbar pb-1 lg:pb-0">
                  {menuItems.map((item) => {
                    const isActive = tabKey === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleTabChange(item.key)}
                        className={`flex-shrink-0 lg:w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-global-primary text-white shadow-md shadow-amber-200/60 lg:translate-x-0.5"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-base transition-colors ${isActive ? "text-white" : "text-gray-400"}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {"count" in item && item.count && item.count > 0 ? (
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full leading-none ${
                              isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.count}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </aside>

          {/* Content Panel */}
          <main className="flex-1 w-full min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[480px]">
              {/* Section header strip */}
              <div className="flex items-center gap-3 px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/60">
                <span className="w-8 h-8 rounded-lg bg-global-primary text-white flex items-center justify-center text-base shadow-sm">
                  {activeItem?.icon}
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-none">
                    {activeItem?.label}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                    Manage your {activeItem?.label?.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-8 animate-in fade-in slide-in-from-bottom-3 duration-400 overflow-x-auto sm:overflow-visible">
                {activeItem?.component}
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
