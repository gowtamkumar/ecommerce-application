"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { userProfileRoute } from "@/NavBarRoute";
import {
  selectLayout,
  setCollapsed,
  setOpen,
} from "@/redux/features/layout/layoutSlice";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout } from "antd";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import NotificationDropdown from "./header/NotificationDropdown";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const { Header } = Layout;
  const layout = useSelector(selectLayout);
  const router = useRouter();
  const dispatch = useDispatch();
  const session = useSession();
  const profileImage = session.data?.user?.image;
  const userName = session.data?.user?.name || "Admin User";
  const userRole = session.data?.user?.role || "Administrator";

  return (
    <Header
      style={{
        padding: "0 32px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 72,
        borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-6">
        {/* Toggle Button - Desktop */}
        <div hidden={layout.screenWidth < 820}>
          <Button
            type="text"
            icon={
              layout.collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: "20px", color: "#1f2937" }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: "20px", color: "#1f2937" }} />
              )
            }
            onClick={() => dispatch(setCollapsed(!layout.collapsed))}
            style={{
              fontSize: "20px",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
            className="hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>

        {/* Toggle Button - Mobile */}
        <div hidden={layout.screenWidth > 820}>
          <Button
            type="text"
            icon={<MenuUnfoldOutlined style={{ fontSize: "20px", color: "#1f2937" }} />}
            onClick={() => dispatch(setOpen(true))}
            style={{
              fontSize: "20px",
              width: 48,
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
            className="hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
          />
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Quick Settings - Desktop Only */}
        <div className="hidden xl:block">
          <Button
            type="text"
            onClick={() => 
              router.push("/dashboard/general-setting?tab=site_settings")

            }
            icon={<SettingOutlined style={{ fontSize: "18px", color: "#6b7280" }} />}
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
            }}
            className="hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-300"
          />
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 32,
            background: "linear-gradient(180deg, transparent, #e5e7eb, transparent)",
            margin: "0 8px",
          }}
        />

        {/* Profile Dropdown */}
        <Dropdown
          menu={{ items: userProfileRoute as any }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <div
            className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl transition-all duration-300"

          >
            <Avatar
              size={44}
              src={getUploadImageUrl(profileImage)}
              icon={!profileImage && <UserOutlined />}
              style={{
                backgroundColor: profileImage ? undefined : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "2px solid #ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(102, 126, 234, 0.1)",
              }}
            />
            <div className="hidden lg:block pr-2">
              <p className="text-sm font-semibold text-gray-900 mb-0 leading-tight">
                {userName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    boxShadow: "0 0 6px rgba(16, 185, 129, 0.5)",
                  }}
                />
                <p className="text-xs text-gray-500 mb-0">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </Dropdown>
      </div>

      <style jsx global>{`
        .search-input-premium:hover,
        .search-input-premium:focus {
          border-color: rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15) !important;
        }
      `}</style>
    </Header>
  );
}
