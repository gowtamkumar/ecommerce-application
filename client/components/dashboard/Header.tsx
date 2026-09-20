"use client";

import {
    selectLayout,
    setCollapsed,
    setOpen,
} from "@/redux/features/layout/layoutSlice";
import {
    ExportOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    RightOutlined,
    SettingOutlined,
    ShopOutlined,
} from "@ant-design/icons";
import { Layout, Tooltip } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationDropdown from "../share-component/NotificationDropdown";
import AdminProfileDropdown from "./AdminProfileDropdown";
import DashboardQuickSearch from "./DashboardQuickSearch";

const { Header } = Layout;

export default function DashboardHeader() {
  const layout = useSelector(selectLayout);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const session = useSession();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 820) {
      dispatch(setOpen(!layout.open));
    } else {
      dispatch(setCollapsed(!layout.collapsed));
    }
  };

  // Format breadcrumbs from path
  const pathSegments = (pathname || "")
    .split("/")
    .filter(Boolean)
    .slice(1); // skip 'dashboard'

  const currentModule = pathSegments[0] ? pathSegments[0].replace(/-/g, " ") : "Overview";
  const currentSubpage = pathSegments.slice(1).map((s) => s.replace(/-/g, " ")).join(" / ");

  return (
    <Header className="bg-white/95 backdrop-blur-md px-3 sm:px-6 h-16 sticky top-0 z-[100] flex items-center justify-between border-b border-gray-200/80 shadow-2xs leading-normal">
      {/* ── Left: Sidebar Toggle & Breadcrumb ── */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Tooltip
          title={layout.collapsed ? "Expand sidebar" : "Collapse sidebar"}
          placement="bottom"
        >
          <button
            type="button"
            onClick={handleToggleSidebar}
            aria-label="Toggle navigation menu"
            className="w-9.5 h-9.5 inline-flex items-center justify-center rounded-xl bg-gray-50/90 hover:bg-gray-100 border border-gray-200/80 text-gray-700 hover:text-global-primary transition-all cursor-pointer shadow-2xs shrink-0"
          >
            {layout.collapsed ? (
              <MenuUnfoldOutlined className="text-base" />
            ) : (
              <MenuFoldOutlined className="text-base" />
            )}
          </button>
        </Tooltip>

        {/* Breadcrumb Path & Page Title */}
        <div className="min-w-0 hidden md:flex items-center gap-1.5 text-xs">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-global-primary transition-colors font-medium"
          >
            <HomeOutlined className="text-xs" />
            <span>Dashboard</span>
          </Link>

          <RightOutlined className="text-[10px] text-gray-300 shrink-0" />

          <span className="font-bold text-gray-900 capitalize truncate">
            {currentModule}
          </span>

          {currentSubpage && (
            <>
              <RightOutlined className="text-[10px] text-gray-300 shrink-0" />
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 capitalize truncate">
                {currentSubpage}
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Center: Quick Search Command Palette ── */}
      <div className="mx-2 sm:mx-4 flex-1 max-w-md hidden md:flex justify-center">
        <DashboardQuickSearch />
      </div>

      {/* ── Right: Action Buttons & Profile ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* View Live Store */}
        <Tooltip title="View customer-facing storefront" placement="bottom">
          <Link
            href="/"
            target="_blank"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-global-primary bg-gray-50/80 hover:bg-global-primary/5 border border-gray-200/80 hover:border-global-primary/30 rounded-xl transition-all shadow-2xs group"
          >
            <ShopOutlined className="text-sm text-gray-400 group-hover:text-global-primary transition-colors" />
            <span>Live Store</span>
            <ExportOutlined className="text-[10px] text-gray-400 group-hover:text-global-primary transition-colors ml-0.5" />
          </Link>
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip
          title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
          placement="bottom"
        >
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle Fullscreen"
            className="w-9.5 h-9.5 hidden sm:inline-flex items-center justify-center rounded-xl bg-gray-50/80 hover:bg-gray-100 border border-gray-200/80 text-gray-600 hover:text-gray-900 transition-all cursor-pointer shadow-2xs"
          >
            {isFullscreen ? (
              <FullscreenExitOutlined className="text-base" />
            ) : (
              <FullscreenOutlined className="text-base" />
            )}
          </button>
        </Tooltip>

        {/* Quick Settings */}
        <Tooltip title="General Store Settings" placement="bottom">
          <button
            type="button"
            onClick={() => router.push("/dashboard/general-setting?tab=site_settings")}
            aria-label="Settings"
            className="w-9.5 h-9.5 inline-flex items-center justify-center rounded-xl bg-gray-50/80 hover:bg-gray-100 border border-gray-200/80 text-gray-600 hover:text-gray-900 transition-all cursor-pointer shadow-2xs"
          >
            <SettingOutlined className="text-base" />
          </button>
        </Tooltip>

        {/* Notification Bell */}
        <NotificationDropdown variant="dashboard" />

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-gray-200/80 mx-1 hidden sm:block" />

        {/* Executive Admin Profile */}
        <AdminProfileDropdown user={session.data?.user} />
      </div>
    </Header>
  );
}
