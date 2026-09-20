"use client";

import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { handleBackup } from "@/NavBarRoute";
import {
    DashboardOutlined,
    DatabaseOutlined,
    DownOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShopOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, message } from "antd";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

interface AdminProfileDropdownProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function AdminProfileDropdown({ user: propUser }: AdminProfileDropdownProps) {
  const { data: session } = useSession();
  const user = propUser || session?.user;
  const [backingUp, setBackingUp] = useState(false);

  const userName = user?.name || "Administrator";
  const userEmail = user?.email || "admin@store.com";
  const userRole = user?.role || "Admin";
  const userImage = user?.image;

  const onBackupClick = async () => {
    try {
      setBackingUp(true);
      message.loading({ content: "Creating database backup...", key: "backup" });
      await handleBackup();
      message.success({ content: "Database backup downloaded successfully!", key: "backup" });
    } catch (error: any) {
      message.error({ content: error?.message || "Failed to download backup", key: "backup" });
    } finally {
      setBackingUp(false);
    }
  };

  const menuItems = [
    {
      key: "user-header",
      type: "group" as const,
      label: (
        <div className="px-1 py-1.5 border-b border-gray-100 pb-3 mb-1">
          <div className="flex items-center gap-3">
            <Avatar
              size={42}
              src={getUploadImageUrl(userImage || undefined)}
              className="border border-gray-200 shadow-xs shrink-0"
              style={{
                backgroundColor: "var(--global-primary, #4f46e5)",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 truncate block">
                  {userName}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 shrink-0">
                  {userRole}
                </span>
              </div>
              <span className="text-xs text-gray-400 truncate block mt-0.5">
                {userEmail}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "dashboard",
      icon: <DashboardOutlined className="text-base text-gray-500" />,
      label: (
        <Link href="/dashboard" className="text-xs font-semibold text-gray-700 hover:text-global-primary">
          Dashboard Overview
        </Link>
      ),
    },
    {
      key: "account",
      icon: <UserOutlined className="text-base text-gray-500" />,
      label: (
        <Link href="/profile?tab=my_account" className="text-xs font-semibold text-gray-700 hover:text-global-primary">
          Admin Profile & Security
        </Link>
      ),
    },
    {
      key: "settings",
      icon: <SettingOutlined className="text-base text-gray-500" />,
      label: (
        <Link href="/dashboard/general-setting?tab=site_settings" className="text-xs font-semibold text-gray-700 hover:text-global-primary">
          Store Settings
        </Link>
      ),
    },
    {
      key: "backup",
      icon: <DatabaseOutlined className="text-base text-gray-500" />,
      label: (
        <span
          onClick={onBackupClick}
          className="text-xs font-semibold text-gray-700 hover:text-global-primary flex items-center justify-between cursor-pointer"
        >
          <span>Database Backup</span>
          {backingUp && <span className="text-[10px] text-amber-600 font-bold">Exporting...</span>}
        </span>
      ),
    },
    {
      key: "storefront",
      icon: <ShopOutlined className="text-base text-gray-500" />,
      label: (
        <Link href="/" target="_blank" className="text-xs font-semibold text-gray-700 hover:text-global-primary">
          View Storefront
        </Link>
      ),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined className="text-base text-red-500" />,
      danger: true,
      label: (
        <span
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs font-bold text-red-600 cursor-pointer block"
        >
          Sign Out
        </span>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
      classNames={{ root: "pt-2 admin-profile-dropdown" }}
      styles={{
        root: {
          minWidth: 260,
        },
      }}
    >
      <button
        type="button"
        className="flex items-center gap-2.5 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 rounded-2xl hover:bg-gray-100/90 border border-transparent hover:border-gray-200/80 transition-all cursor-pointer group select-none text-left"
      >
        <div className="relative">
          <Avatar
            size={36}
            src={getUploadImageUrl(userImage || undefined)}
            className="border border-gray-200 shadow-2xs group-hover:scale-105 transition-transform"
            style={{
              backgroundColor: "var(--global-primary, #4f46e5)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full"
            style={{ backgroundColor: "#10b981" }}
            title="Online"
          />
        </div>

        <div className="hidden sm:flex flex-col min-w-0 leading-none">
          <span className="text-xs font-bold text-gray-900 group-hover:text-global-primary transition-colors truncate max-w-[130px]">
            {userName}
          </span>
          <span className="text-[10px] text-gray-400 font-medium capitalize mt-1">
            {userRole}
          </span>
        </div>

        <DownOutlined className="text-[10px] text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ml-0.5 hidden sm:inline-block" />
      </button>
    </Dropdown>
  );
}

