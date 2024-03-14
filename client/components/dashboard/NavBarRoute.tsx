import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";

// key as like features 

const navbarRoute = [
  {
    key: "dashboard",
    icon: <UserOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
    route: true,
  },
  {
    key: "customers",
    icon: <VideoCameraOutlined />,
    label: <Link href="/dashboard/customers">Customers</Link>,
    route: true,
  },
  {
    key: "report",
    label: "Report",
    disabled: true,
    route: true
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: "nav 3",
    route: true,
    children: [
      {
        key: "01",
        icon: <UserOutlined />,
        label: "nav 1",
        route: true,
      },
      {
        key: "02",
        icon: <VideoCameraOutlined />,
        label: "nav 2",
        route: true,
      },
      {
        key: "03",
        icon: <UserOutlined />,
        label: "nav 1",
        route: true,
      },
      {
        key: "04",
        icon: <VideoCameraOutlined />,
        label: "nav 2",
        route: true,
      },
    ],
  },
];

const profileRoute: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    ),
    icon: <UserOutlined />,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    ),
    icon: <UserOutlined />,
  },
];

export { navbarRoute, profileRoute };
