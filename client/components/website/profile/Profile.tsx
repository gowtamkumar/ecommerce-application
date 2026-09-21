"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { getUserOrders } from "@/lib/apis/orders";
import { getMe } from "@/lib/apis/user";
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
import { Tooltip } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FiArrowUpRight,
    FiAward,
    FiCalendar,
    FiCamera,
    FiCheck,
    FiClock,
    FiCopy,
    FiCreditCard,
    FiEdit2,
    FiHeart,
    FiMail,
    FiPhone,
    FiShield,
    FiShoppingBag,
} from "react-icons/fi";
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
  const [userData, setUserData] = useState<any>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const searchQuery = useSearchParams();
  const categoryIdParams = searchQuery.get("tab");
  const route = useRouter();
  const { data: session } = useSession();
  const { formatPrice } = useCurrency();

  const tabKey = categoryIdParams ?? "my_account";

  useEffect(() => {
    const fetchStatsAndUser = async () => {
      try {
        const [ordersRes, wishlistRes, userRes] = await Promise.all([
          getUserOrders("").catch(() => ({ data: [] })),
          getUserWishlists().catch(() => ({ data: [] })),
          getMe().catch(() => null),
        ]);
        const orders = ordersRes?.data || [];
        const wishlist = wishlistRes?.data || [];
        const totalSpending = orders
          .filter((o: any) => o.status === "Delivered")
          .reduce(
            (acc: number, o: any) =>
              acc + (Number(o.grandTotal) - Number(o.totalReturned)),
            0
          );
        setStats({ orders: orders.length, wishlist: wishlist.length, spending: totalSpending });
        if (userRes?.data) {
          setUserData(userRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile stats and user data", err);
      }
    };
    if (session) fetchStatsAndUser();
  }, [session]);

  const userImage = userData?.image || session?.user?.image;
  const userName = userData?.name || session?.user?.name || "Customer";
  const userEmail = userData?.email || session?.user?.email || "";
  const userPhone = userData?.phone;
  const userRole = userData?.role || "Member";
  const memberSince = userData?.createdAt
    ? dayjs(userData.createdAt).format("MMM YYYY")
    : null;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userEmail) return;
    navigator.clipboard.writeText(userEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
      {/* ── Premium Hero Header ── */}
      <div className="relative bg-[#0b1120] border-b border-gray-800/80 overflow-hidden">
        {/* Amber brand accent top line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-global-primary via-amber-300 to-global-primary" />

        {/* Ambient atmospheric lighting */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-global-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle dot matrix pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
          {/* Identity & Actions Bar */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">

            {/* Left: Avatar & Identity Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6">
              
              {/* Avatar with status ring and edit trigger */}
              <div className="relative group shrink-0">
                <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl ring-4 ring-global-primary/30 transition-all duration-300 group-hover:ring-global-primary/60 bg-gray-900">
                  {userImage ? (
                    <Image
                      src={getImageUrl(userImage)}
                      alt={userName}
                      width={104}
                      height={104}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-700 text-white text-3xl font-black shadow-inner">
                      {userInitial}
                    </div>
                  )}

                  {/* Hover Change Photo Overlay */}
                  <button
                    onClick={() => route.replace("/profile?tab=my_account&edit=true", { scroll: false })}
                    className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                    title="Change Photo"
                  >
                    <FiCamera className="text-lg mb-0.5 text-amber-300" />
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Edit Photo</span>
                  </button>
                </div>

                {/* Online / Active status pulse */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0b1120]" />
                </span>
              </div>

              {/* Name, Badges & Meta */}
              <div className="flex-1 min-w-0">
                {/* Badges / Tier */}
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Verified Customer
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    <FiAward className="text-xs" />
                    {userRole === "Admin" ? "Admin Member" : "Club Member"}
                  </span>
                </div>

                {/* User Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-1">
                  {userName}
                </h1>

                {/* Meta details: Email (clickable copy), Phone, Member Since */}
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 flex-wrap text-xs text-gray-300/80 font-medium">
                  {/* Email with copy */}
                  {userEmail && (
                    <Tooltip title={copiedEmail ? "Copied to clipboard!" : "Click to copy email"}>
                      <button
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group/email py-0.5"
                      >
                        <FiMail className="text-gray-400 group-hover/email:text-amber-400 transition-colors" />
                        <span className="truncate max-w-[200px] sm:max-w-none">{userEmail}</span>
                        {copiedEmail ? (
                          <FiCheck className="text-emerald-400 text-xs shrink-0" />
                        ) : (
                          <FiCopy className="text-gray-500 group-hover/email:text-gray-300 text-xs shrink-0 transition-colors" />
                        )}
                      </button>
                    </Tooltip>
                  )}

                  {/* Phone */}
                  {userPhone && (
                    <span className="inline-flex items-center gap-1.5 text-gray-300/80">
                      <FiPhone className="text-gray-400" />
                      <span>{userPhone}</span>
                    </span>
                  )}

                  {/* Member Since */}
                  {memberSince && (
                    <span className="inline-flex items-center gap-1.5 text-gray-300/80">
                      <FiCalendar className="text-gray-400" />
                      <span>Member since {memberSince}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action CTAs */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center sm:justify-start">
              <button
                onClick={() => route.replace("/profile?tab=my_account&edit=true", { scroll: false })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-amber-400/40 shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <FiEdit2 className="text-amber-400 text-sm" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={() => handleTabChange("track_order")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-sm"
              >
                <FiClock className="text-gray-400 text-sm" />
                <span>Track Order</span>
              </button>
            </div>
          </div>

          {/* Bottom KPI Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
            {/* Card 1: Orders */}
            <button
              onClick={() => handleTabChange("orders")}
              className="group text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                  <FiShoppingBag />
                </span>
                <FiArrowUpRight className="text-gray-500 group-hover:text-amber-400 transition-colors text-base" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white leading-none mb-1 tracking-tight">
                  {stats.orders}
                </p>
                <p className="text-[11px] font-bold text-gray-300/80 uppercase tracking-wider">Total Orders</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">View order history →</p>
              </div>
            </button>

            {/* Card 2: Wishlist */}
            <button
              onClick={() => handleTabChange("wishlist")}
              className="group text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-rose-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                  <FiHeart />
                </span>
                <FiArrowUpRight className="text-gray-500 group-hover:text-rose-400 transition-colors text-base" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white leading-none mb-1 tracking-tight">
                  {stats.wishlist}
                </p>
                <p className="text-[11px] font-bold text-gray-300/80 uppercase tracking-wider">Saved Wishlist</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">Explore saved items →</p>
              </div>
            </button>

            {/* Card 3: Spending */}
            <button
              onClick={() => handleTabChange("orders")}
              className="group text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                  <FiCreditCard />
                </span>
                <FiArrowUpRight className="text-gray-500 group-hover:text-emerald-400 transition-colors text-base" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white leading-none mb-1 tracking-tight truncate">
                  {formatPrice(stats.spending)}
                </p>
                <p className="text-[11px] font-bold text-gray-300/80 uppercase tracking-wider">Total Spent</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">Delivered purchases</p>
              </div>
            </button>

            {/* Card 4: Security & Status */}
            <button
              onClick={() => handleTabChange("change_password")}
              className="group text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
                  <FiShield />
                </span>
                <FiArrowUpRight className="text-gray-500 group-hover:text-blue-400 transition-colors text-base" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 leading-none mb-1 tracking-tight flex items-center gap-1.5">
                  <span>Protected</span>
                </p>
                <p className="text-[11px] font-bold text-gray-300/80 uppercase tracking-wider">Account Security</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">Manage password →</p>
              </div>
            </button>
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
                    {tabKey === "my_account"
                      ? "Manage your account details and preferences"
                      : `Manage your ${activeItem?.label?.toLowerCase()}`}
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
