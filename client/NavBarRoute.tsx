import {
  FaBeer,
  FaProductHunt,
  FaRegCircle,
  FaRegUser,
  FaUser,
} from "react-icons/fa";
import { MenuProps } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { backupDB } from "./lib/apis/backupDB";
import appConfig from "./appConfig";
import {
  MdBrandingWatermark,
  MdCategory,
  MdDashboard,
  MdLocalShipping,
  MdOutlineDiscount,
  MdPayment,
} from "react-icons/md";
import { IoReorderFour } from "react-icons/io5";
import { RiBatteryChargeFill } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";

// key as like features

const handleBackup = async (): Promise<void> => {
  const date = new Date();
  const pad = (num: number): string => num.toString().padStart(2, "0");
  const currentDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}-${pad(date.getHours())}-${pad(date.getMinutes())}`;

  try {
    // const response = await backupDB();

    const response = await fetch(`${appConfig.apiUrl}/settings/db-backup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ a: 1, b: "Textual content" }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `backup-${currentDate}.sql.zip`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link); // Use optional chaining for safety
    window.URL.revokeObjectURL(url); // Clean up the URL object
  } catch (error) {
    console.error("Backup failed:", error);
    alert("Backup failed");
  }
};

const navbarRoute = [
  {
    key: "dashboard",
    icon: <MdDashboard className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard">Dashboard</Link>,
    route: "true",
  },

  {
    key: "product",
    icon: <FaProductHunt className="h-5 w-5 text-blue-500" />,
    label: "Product Manage",
    route: "true",
    children: [
      {
        key: "new_product",
        icon: <FaRegCircle className="h-4 w-4 text-blue-500" />,
        label: <Link href="/dashboard/product/new">New Product</Link>,
        route: "true",
      },
      {
        key: "products",
        icon: <FaRegCircle className="h-4 w-4 text-blue-500" />,
        label: <Link href="/dashboard/product">Products</Link>,
        route: "true",
      },
    ],
  },

  // {
  //   key: "size",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/size">Size</Link>,
  //   route: "true",
  // },
  // {
  //   key: "unit",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/unit">Unit</Link>,
  //   route: "true",
  // },
  // {
  //   key: "color",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/color">Color</Link>,
  //   route: "true",
  // },

  {
    key: "category",
    icon: <MdCategory className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/category">Category</Link>,
    route: "true",
  },
  {
    key: "brands",
    icon: <MdBrandingWatermark className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/brands">Brands</Link>,
    route: "true",
  },
  // {
  //   key: "taxs",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/taxs">Taxs</Link>,
  //   route: "true",
  // },

  // {
  //   key: "wishlists",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/wishlists">Wishlists</Link>,
  //   route: "true",
  // },
  // {
  //   key: "status",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/status">Status</Link>,
  //   route: "true",
  // },
  {
    key: "payment_manage",
    icon: <MdPayment className="h-5 w-5 text-blue-500" />,
    label: "Payment Manage",
    route: "true",
    children: [
      {
        key: "new_payment",
        icon: <FaRegCircle className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/payments/new">New payment</Link>,
        route: "true",
      },
      {
        key: "Payment",
        icon: <FaRegCircle className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/payments">Payments</Link>,
        route: "true",
      },
    ],
  },

  {
    key: "order_manage",
    label: "Order Manage",
    disabled: "true",
    route: "true",
  },
  {
    key: "today_order",
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/today-order">Today Order</Link>,
    route: "true",
  },
  {
    key: "order",
    icon: <IoReorderFour className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/orders">Orders</Link>,
    route: "true",
  },
  // {
  //   key: "return_manage",
  //   label: "Return Manage",
  //   disabled: "true",
  //   route: "true",
  // },

  // {
  //   key: "return_request",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/return">Return</Link>,
  //   route: "true",
  // },

  // {
  //   key: "blog",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: "Blog Manage",
  //   route: "true",
  //   children: [
  //     {
  //       key: "new_post",
  //       icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //       label: <Link href="/dashboard/post/new">New Post</Link>,
  //       route: "true",
  //     },
  //     {
  //       key: "posts",
  //       icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //       label: <Link href="/dashboard/post">Posts</Link>,
  //       route: "true",
  //     },
  //   ],
  // },

  {
    key: "discount_manage",
    label: "Manage Discount",
    disabled: "true",
    route: "true",
  },

  {
    key: "discount",
    icon: <MdOutlineDiscount className="h-5 w-5 text-blue-500" />,
    label: "Discount Manage",
    route: "true",
    children: [
      {
        key: "new_discount",
        icon: <FaRegCircle className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/discounts/new">New discount</Link>,
        route: "true",
      },
      {
        key: "discounts",
        icon: <FaRegCircle className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/discounts">Discounts</Link>,
        route: "true",
      },
    ],
  },

  {
    key: "Shipping_managment",
    label: "Shipping",
    disabled: "true",
    route: "true",
  },

  {
    key: "shipping_address",
    icon: <MdLocalShipping className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/shipping-address">Shipping Address</Link>,
    route: "true",
  },

  {
    key: "shipping_charge",
    icon: <RiBatteryChargeFill className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/shipping-charges">Shipping Charge</Link>,
    route: "true",
  },

  {
    key: "report_section",
    label: "Report",
    disabled: "true",
    route: "true",
  },
  {
    key: "report",
    icon: <TbReport className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/report">Report</Link>,
    route: "true",
  },
  // {
  //   key: "review",
  //   icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  //   label: <Link href="/dashboard/review">Review</Link>,
  //   route: "true",
  // },

  {
    key: "setting",
    label: "Setting",
    disabled: "true",
    route: "true",
  },

  {
    key: "user",
    icon: <FaUser className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/user">User</Link>,
    route: "true",
  },
  {
    key: "setting_manage",
    icon: <IoIosSettings className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/setting?tab=company_setting">Setting</Link>,
    route: "true",
  },
  {
    key: "web_setting",
    icon: <IoIosSettings className="h-5 w-5 text-blue-500" />,
    label: <Link href="/dashboard/website-setting">Web Setting </Link>,
    route: "true",
  },
];

const profileRoute: MenuProps["items"] = [
  {
    key: "my_account",
    label: <Link href={"/profile"}>My Account</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "orders",
    label: <Link href="/profile">Orders</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "wishlist",
    label: <Link href="/profile">Wishlist</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "order_track",
    label: <Link href="/profile">Order Track</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "logout",
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
    key: "my_account",
    label: <Link href="/profile?tab=my_account">My Account</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "orders",
    label: <Link href="/profile?tab=orders">Orders</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "wishlist",
    label: <Link href="/profile?tab=wishlist">Wishlist</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "order_track",
    label: <Link href="/profile?tab=track_order">Order Track</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "logout",
    label: <Link href="/">Logout</Link>,
    icon: <FaBeer className="h-5 w-5 text-blue-500" />,
    onClick: () => {
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
          <a
            href="https://ant.design"
            target="_blank"
            rel="noopener noreferrer"
          >
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
