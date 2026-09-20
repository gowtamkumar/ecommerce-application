"use client";
import {
  selectLayout,
  setCollapsed,
  setOpen,
} from "@/redux/features/layout/layoutSlice";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import NotificationDropdown from "../share-component/NotificationDropdown";
import ProfileDropdown from "../share-component/ProfileDropdown";

export default function DashboardHeader() {
  const { Header } = Layout;
  const layout = useSelector(selectLayout);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const session = useSession();
  const profileImage = session.data?.user?.image;

  const pageLabel =
    pathname
      ?.split("/")
      .filter(Boolean)
      .slice(1)
      .map((s) => s.replace(/-/g, " "))
      .join(" / ") || "Overview";

  return (
    <Header className="bg-white/95 backdrop-blur-md px-4 sm:px-6 h-16 leading-[64px] sticky top-0 z-[100] flex items-center justify-between border-b border-gray-200/80 shadow-none">
      <div className="flex items-center gap-3 min-w-0">
        <div hidden={layout.screenWidth < 820}>
          <Button
            type="text"
            aria-label="Toggle sidebar"
            icon={
              layout.collapsed ? (
                <MenuUnfoldOutlined className="text-gray-700 text-lg" />
              ) : (
                <MenuFoldOutlined className="text-gray-700 text-lg" />
              )
            }
            onClick={() => dispatch(setCollapsed(!layout.collapsed))}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
          />
        </div>

        <div hidden={layout.screenWidth > 820}>
          <Button
            type="text"
            aria-label="Open menu"
            icon={<MenuUnfoldOutlined className="text-gray-700 text-lg" />}
            onClick={() => dispatch(setOpen(true))}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
          />
        </div>

        <div className="min-w-0 hidden sm:block">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium m-0 leading-none">
            Admin
          </p>
          <p className="text-sm font-semibold text-gray-900 capitalize truncate m-0 leading-tight mt-0.5">
            {pageLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden md:inline-flex text-xs font-medium text-gray-600 hover:text-global-primary px-3 py-1.5 rounded-lg border border-gray-200 hover:border-global-primary/40 transition-colors"
        >
          View store
        </Link>

        <Button
          type="text"
          aria-label="Settings"
          onClick={() =>
            router.push("/dashboard/general-setting?tab=site_settings")
          }
          icon={<SettingOutlined className="text-gray-500 text-base" />}
          className="w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-gray-100"
        />

        <NotificationDropdown />

        <div className="w-px h-6 bg-gray-200 mx-1" />

        <ProfileDropdown profileImage={profileImage} />
      </div>
    </Header>
  );
}
