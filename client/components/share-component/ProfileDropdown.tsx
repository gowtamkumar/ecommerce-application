"use client";

import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { IoReorderFour } from "react-icons/io5";
import { MdDashboard, MdOutlineSpatialTracking } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { SiWish } from "react-icons/si";

interface ProfileDropdownProps {
  profileImage?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function ProfileDropdown({
  profileImage: propImage,
  user: propUser,
}: ProfileDropdownProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const currentUser = propUser || session?.user;
  const userName = currentUser?.name || "Customer";
  const userEmail = currentUser?.email || "";
  const userRole = currentUser?.role || "Customer";
  const userImage = currentUser?.image || propImage;
  const isAdmin = userRole?.toLowerCase() === "admin";

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      trigger={["click"]}
      popupRender={() => (
        <div className="w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 ring-1 ring-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Header Profile Card */}
          <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="relative shrink-0">
                <Avatar
                  size={46}
                  src={getUploadImageUrl(userImage)}
                  className="border-2 border-white/20 shadow-md object-cover bg-amber-500 text-white font-bold"
                >
                  {(userName || "U").charAt(0).toUpperCase()}
                </Avatar>
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full"
                  style={{ backgroundColor: "#10b981" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white truncate block">
                    {userName}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      isAdmin
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                        : "bg-white/10 text-white/80 border border-white/10"
                    }`}
                  >
                    {userRole}
                  </span>
                </div>
                {userEmail && (
                  <span className="text-xs text-slate-300 truncate block mt-0.5">
                    {userEmail}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Account Navigation List */}
          <div className="p-2 space-y-0.5">
            {isAdmin && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50/80 text-gray-700 hover:text-amber-800 transition-colors group/item"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                    <MdDashboard className="text-base" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-900 group-hover/item:text-amber-800">
                      Admin Dashboard
                    </span>
                    <span className="block text-[10px] text-gray-400">
                      Store management & reports
                    </span>
                  </div>
                </div>
                <ArrowRightOutlined className="text-[10px] text-gray-400 group-hover/item:text-amber-700 group-hover/item:translate-x-0.5 transition-all" />
              </Link>
            )}

            <Link
              href="/profile?tab=my_account"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                  <RiAccountCircleLine className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-800 group-hover/item:text-gray-900">
                    My Account
                  </span>
                  <span className="block text-[10px] text-gray-400">
                    Personal info & preferences
                  </span>
                </div>
              </div>
              <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover/item:text-gray-500 group-hover/item:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/profile?tab=orders"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                  <IoReorderFour className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-800 group-hover/item:text-gray-900">
                    My Orders
                  </span>
                  <span className="block text-[10px] text-gray-400">
                    Track shipments & order history
                  </span>
                </div>
              </div>
              <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover/item:text-gray-500 group-hover/item:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/profile?tab=wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                  <SiWish className="text-base" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-800 group-hover/item:text-gray-900">
                    Wishlist
                  </span>
                  <span className="block text-[10px] text-gray-400">
                    Saved items for later
                  </span>
                </div>
              </div>
              <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover/item:text-gray-500 group-hover/item:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/profile?tab=track_order"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-gray-700 hover:text-gray-900 transition-colors group/item"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform">
                  <MdOutlineSpatialTracking className="text-base" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-800 group-hover/item:text-gray-900">
                    Order Track
                  </span>
                  <span className="block text-[10px] text-gray-400">
                    Real-time parcel status
                  </span>
                </div>
              </div>
              <ArrowRightOutlined className="text-[10px] text-gray-300 group-hover/item:text-gray-500 group-hover/item:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1" />

          {/* Logout Action */}
          <div className="p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50/80 transition-colors text-left cursor-pointer group/logout"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover/logout:bg-rose-100 text-gray-600 group-hover/logout:text-rose-600 flex items-center justify-center shrink-0 transition-colors">
                <CiLogout className="text-lg" />
              </div>
              <div>
                <span className="block text-xs font-semibold">Sign Out</span>
                <span className="block text-[10px] text-gray-400">
                  Log out of your account
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    >
      <button
        type="button"
        aria-label="User profile menu"
        className={`relative flex items-center justify-center rounded-full p-0.5 transition-all duration-200 cursor-pointer ${
          open
            ? "ring-2 ring-amber-500 shadow-md scale-105"
            : "ring-1 ring-gray-200 hover:ring-2 hover:ring-amber-400 hover:shadow-sm"
        }`}
      >
        <Avatar
          size={36}
          src={getUploadImageUrl(userImage)}
          className="shadow-xs object-cover bg-amber-500 text-white font-bold"
        >
          {(userName || "U").charAt(0).toUpperCase()}
        </Avatar>

        {/* Online Indicator */}
        <span
          className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full shadow-xs"
          style={{ backgroundColor: "#10b981" }}
        />
      </button>
    </Dropdown>
  );
}
