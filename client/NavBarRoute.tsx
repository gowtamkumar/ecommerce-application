import { FaBeer, FaRegUser } from "react-icons/fa";
import { MenuProps } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { backupDB } from "./lib/apis/backupDB";

// key as like features




const handleBackup = async () => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}.${date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;


  try {

    const response = await backupDB()
    // const response = await fetch(
    //   `http://localhost:3900/api/v1/settings/db-backup`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ a: 1, b: "Textual content" }),
    //   }
    // );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `backup-${currentDate}.sql`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Backup failed:", error);
    alert("Backup failed");
  }
};

const navbarRoute = [
  {
    key: "dashboard",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard">Dashboard</Link>,
    route: "true",
  },
  {
    key: "Size",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/size">Size</Link>,
    route: "true",
  },
  {
    key: "customers",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/customers">Customers</Link>,
    route: "true",
  },
  {
    key: "orders",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/orders">Orders</Link>,
    route: "true",
  },
  {
    key: "kitchen_dashboard",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
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
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    label: "nav 3",
    route: "true",
    children: [
      {
        key: "01",
        icon: <FaBeer className="h-5 w-5 text-blue-500" />,
        label: "nav 1",
        route: "true",
      },
      {
        key: "02",
        icon: <FaBeer className="h-5 w-5 text-blue-500" />,
        label: "nav 2",
        route: "true",
      },
      {
        key: "03",
        icon: <FaBeer className="h-5 w-5 text-blue-500" />,
        label: "nav 1",
        route: "true",
      },
      {
        key: "04",
        icon: <FaBeer className="h-5 w-5 text-blue-500" />,
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
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "2",
    label: <Link href="/">Logout</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    onClick: () => {
      signOut();
    },
  },
  {
    key: "3",
    label: "Database Backup",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    onClick: () => {
      handleBackup();
    },
  },
];

const userProfileRoute: MenuProps["items"] = [
  {
    key: "1",
    label: <Link href="/profile">Profile</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "2",
    label: <Link href="/">Logout</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    onClick: () => {
      // "use server";
      signOut();
    },
  },
];

const webSiteNavbarItems: MenuProps["items"] = [
  {
    label: "Home",
    key: "home",
    icon: <FaRegUser />,
  },
  {
    label: "About us",
    key: "about",
    icon: <FaRegUser />,
    // disabled: true,
  },
  {
    label: "Contract",
    key: "contact",
    icon: <FaRegUser />,
    // disabled: true,
  },

  {
    label: "Category",
    key: "category",
    icon: <FaRegUser />,
    children: [
      {
        label: (
          <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
           Option 1
          </a>
        ),
        key: "alipay",
      },
      {
        type: "group",
        label: "Item 2",
        children: [
          {
            label: "Option 3",
            key: "setting:3",
          },
          {
            label: "Option 4",
            key: "setting:4",
          },
        ],
      },
    ],
  },
  {
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Navigation Four - Link
      </a>
    ),
    key: "alipay",
  },
];

export { navbarRoute, profileRoute, webSiteNavbarItems, userProfileRoute };
