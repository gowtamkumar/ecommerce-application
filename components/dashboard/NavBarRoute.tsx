import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";

// key as like features

const navbarRoute = [
  {
    key: "dashboard",
    icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    label: <Link href="/dashboard">Dashboard</Link>,
    route: "true",
  },
  {
    key: "customers",
    icon: <VideoCameraOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    label: <Link href="/dashboard/customers">Customers</Link>,
    route: "true",
  },
  {
    key: "orders",
    icon: <VideoCameraOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    label: <Link href="/dashboard/orders">Orders</Link>,
    route: "true",
  },
  {
    key: "kitchen_dashboard",
    icon: <VideoCameraOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    label: <Link href="/dashboard/kitchen-dashboard">kitchen-dashboard</Link>,
    route: "true",
  },

  {
    key: "report",
    label: "Report",
    disabled: "true",
    route: "true",
  },
  {
    key: "3",
    icon: <UploadOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    label: "nav 3",
    route: "true",
    children: [
      {
        key: "01",
        icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        label: "nav 1",
        route: "true",
      },
      {
        key: "02",
        icon: <VideoCameraOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        label: "nav 2",
        route: "true",
      },
      {
        key: "03",
        icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        label: "nav 1",
        route: "true",
      },
      {
        key: "04",
        icon: <VideoCameraOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
        label: "nav 2",
        route: "true",
      },
    ],
  },
];

const profileRoute: MenuProps["items"] = [
  {
    key: "1",
    label: <Link href="/dashboard/profile">Profile</Link>,
    icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
  },
  {
    key: "2",
    label: <Link href="/">Logout</Link>,
    icon: <UserOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    onClick: () => signOut(),
  },
];

export { navbarRoute, profileRoute };
