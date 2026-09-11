import { MenuProps } from "antd";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import {
    FaDatabase,
    FaProductHunt,
    FaRegCircle,
    FaUser
} from "react-icons/fa";
import { IoNotifications, IoReorderFour } from "react-icons/io5";
import {
    MdArticle,
    MdCategory,
    MdDashboard,
    MdHistory,
    MdLocalShipping,
    MdOutlineArticle,
    MdOutlineContactPhone,
    MdOutlineDiscount,
    MdOutlinePermMedia,
    MdOutlineSettings,
    MdOutlineSpatialTracking,
    MdPayment,
    MdPostAdd,
    MdTune,
    MdViewModule,
} from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import { SiWish } from "react-icons/si";
import { TbReport } from "react-icons/tb";
import appConfig from "./appConfig";

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
    type: "group",
    label: "Dashboard & Insights",
    children: [
      {
        key: "dashboard",
        icon: <MdDashboard className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard">Dashboard</Link>,
        route: "true",
      },
      {
        key: "report",
        icon: <TbReport className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/report">Report & Analytics</Link>,
        route: "true",
      },
      {
        key: "audit_logs",
        icon: <MdHistory className="h-5 w-5 text-purple-500" />,
        label: <Link href="/dashboard/audit-logs">Audit Logs</Link>,
        route: "true",
      },
      {
        key: "notifications",
        icon: <IoNotifications className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/notifications">Notifications</Link>,
        route: "true",
      },
    ],
  },

  {
    type: "group",
    label: "Catalog & Inventory",
    children: [
      {
        key: "product",
        icon: <FaProductHunt className="h-5 w-5 text-blue-500" />,
        label: "Products",
        route: "true",
        children: [
          {
            key: "new_product",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/product/new">New Product</Link>,
            route: "true",
          },
          {
            key: "products",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/product">All Products</Link>,
            route: "true",
          },
        ],
      },
      {
        key: "category",
        icon: <MdCategory className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/category">Categories</Link>,
        route: "true",
      },
      {
        key: "media",
        icon: <MdOutlinePermMedia className="h-4 w-2 text-blue-500" />,
        label: <Link href="/dashboard/media">Media Library</Link>,
        route: "true",
      },
      {
        key: "stock_adjust",
        icon: <MdTune className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/stock-adjust">Stock Adjust</Link>,
        route: "true",
      },
      {
        key: "other_module",
        icon: <MdViewModule className="h-5 w-5 text-blue-500" />,
        label: "Attributes & Specs",
        route: "true",
        children: [
          {
            key: "brands",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/other-modules?tab=brand">Brands</Link>,
            route: "true",
          },
          {
            key: "color",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/color">Colors</Link>,
            route: "true",
          },
          {
            key: "size",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/size">Sizes</Link>,
            route: "true",
          },
          {
            key: "unit",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/unit">Units</Link>,
            route: "true",
          },
          {
            key: "taxs",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/taxs">Taxes</Link>,
            route: "true",
          },
          {
            key: "banner",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/banner">Banners</Link>,
            route: "true",
          },
          {
            key: "review",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/review">Reviews</Link>,
            route: "true",
          },
          {
            key: "leads",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/other-modules?tab=leads">Leads</Link>,
            route: "true",
          },
          {
            key: "currencies",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/other-modules?tab=currencies">Currencies</Link>,
            route: "true",
          },
        ],
      },
    ],
  },

  {
    type: "group",
    label: "Orders & Fulfillment",
    children: [
      {
        key: "order",
        icon: <IoReorderFour className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/orders">Orders</Link>,
        route: "true",
      },
      {
        key: "return_request",
        icon: <IoReorderFour className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/return">Returns</Link>,
        route: "true",
      },
      {
        key: "refund_manage",
        icon: <MdPayment className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/refunds">Refunds</Link>,
        route: "true",
      },
      {
        key: "shipping_manage",
        icon: <MdLocalShipping className="h-5 w-5 text-blue-500" />,
        label: "Shipping",
        route: "true",
        children: [
          {
            key: "shipping_address",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/shipping-address">Addresses</Link>,
            route: "true",
          },
          {
            key: "shipping_charge",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/shipping-charges">Shipping Charges</Link>,
            route: "true",
          },
        ],
      },
    ],
  },

  {
    type: "group",
    label: "Marketing & Content",
    children: [
      {
        key: "discount",
        icon: <MdOutlineDiscount className="h-5 w-5 text-blue-500" />,
        label: "Discounts",
        route: "true",
        children: [
          {
            key: "new_discount",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/discounts/new">New Discount</Link>,
            route: "true",
          },
          {
            key: "discounts",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/discounts">All Discounts</Link>,
            route: "true",
          },
        ],
      },
      {
        key: "coupon",
        icon: <MdOutlineDiscount className="h-5 w-5 text-blue-500" />,
        label: "Coupons",
        route: "true",
        children: [
          {
            key: "new_coupon",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/coupons/new">New Coupon</Link>,
            route: "true",
          },
          {
            key: "coupons",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/coupons">All Coupons</Link>,
            route: "true",
          },
        ],
      },
      {
        key: "blog",
        icon: <MdOutlineArticle className="h-5 w-5 text-blue-500" />,
        label: "Blog Posts",
        route: "true",
        children: [
          {
            key: "new_post",
            icon: <MdPostAdd className="h-4 w-4 text-blue-500" />,
            label: <Link href="/dashboard/post/new">New Post</Link>,
            route: "true",
          },
          {
            key: "posts",
            icon: <MdArticle className="h-4 w-4 text-blue-500" />,
            label: <Link href="/dashboard/post">All Posts</Link>,
            route: "true",
          },
        ],
      },
      {
        key: "pages",
        icon: <MdOutlinePermMedia className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/pages">Pages</Link>,
        route: "true",
      },
    ],
  },

  {
    type: "group",
    label: "Store & Users",
    children: [
      {
        key: "contacts",
        icon: <MdOutlineContactPhone className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/contacts">Customer Messages</Link>,
        route: "true",
      },
      {
        key: "user",
        icon: <FaUser className="h-5 w-5 text-blue-500" />,
        label: <Link href="/dashboard/user">Users & Staff</Link>,
        route: "true",
      },
      {
        key: "payment_manage",
        icon: <MdPayment className="h-5 w-5 text-blue-500" />,
        label: "Payments",
        route: "true",
        children: [
          {
            key: "new_payment",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/payments/new">New Payment</Link>,
            route: "true",
          },
          {
            key: "Payment",
            icon: <FaRegCircle className="h-4 w-2 text-blue-500" />,
            label: <Link href="/dashboard/payments">Payments</Link>,
            route: "true",
          },
        ],
      },
      {
        key: "general_setting",
        icon: <MdOutlineSettings className="h-5 w-5 text-blue-500" />,
        label: (
          <Link href="/dashboard/general-setting?tab=site_settings">
            General Settings
          </Link>
        ),
        route: "true",
      },
    ],
  },
];

const profileRoute: MenuProps["items"] = [
  {
    key: "my_account",
    label: <Link href={"/profile"}>My Account</Link>,
    icon: <RiAccountCircleLine className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "orders",
    label: <Link href="/profile">Orders</Link>,
    icon: <IoReorderFour className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "wishlist",
    label: <Link href="/profile">Wishlist</Link>,
    icon: <SiWish className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "order_track",
    label: <Link href="/profile">Order Track</Link>,
    icon: <MdOutlineSpatialTracking className="h-5 w-5 text-blue-500" />,
  },
  {
    key: "logout",
    label: <Link href="/">Logout</Link>,
    icon: <CiLogout className="h-5 w-5 text-blue-500" />,
    onClick: () => {
      signOut();
    },
  },
  {
    key: "3",
    label: "Database Backup",
    icon: <FaDatabase className="h-5 w-5 text-blue-500" />,
    onClick: () => {
      handleBackup();
    },
  },
];

const userProfileRoute: MenuProps["items"] = [
  {
    key: "my_account",
    label: <Link href="/profile?tab=my_account">My Account</Link>,
    icon: <RiAccountCircleLine className="h-5 w-5 text-gray-500" />,
  },
  {
    key: "orders",
    label: <Link href="/profile?tab=orders">Orders</Link>,
    icon: <IoReorderFour className="h-5 w-5 text-gray-500" />,
  },
  {
    key: "wishlist",
    label: <Link href="/profile?tab=wishlist">Wishlist</Link>,
    icon: <SiWish className="h-5 w-5 text-gray-500" />,
  },
  {
    key: "order_track",
    label: <Link href="/profile?tab=track_order">Order Track</Link>,
    icon: <MdOutlineSpatialTracking className="h-5 w-5 text-gray-500" />,
  },
  {
    key: "logout",
    label: <Link href="/">Logout</Link>,
    icon: <CiLogout className="h-5 w-5 text-gray-500" />,
    onClick: () => {
      signOut();
    },
  },
];

const webSiteNavbarItems: MenuProps["items"] = [
  {
    label: <Link href="/">Home</Link>,
    key: "home",
  },
  {
    label: <Link href="/about">About us</Link>,
    key: "about",
  },
  {
    label: <Link href="/contact">Contact</Link>,
    key: "contact",
  },

  {
    label: "Categories",
    key: "category",
    children: [
      {
        label: <Link href="/products?categoryId=5">Fashion</Link>,
        key: "fashion",
      },
      {
        label: <Link href="/products?categoryId=10">Kitchen Fittings</Link>,
        key: "kitchen",
      },
      {
        label: <Link href="/products?categoryId=1">Honda</Link>,
        key: "honda",
      },
      {
        label: <Link href="/products?categoryId=2">Yamaha</Link>,
        key: "yamaha",
      },
      {
        label: <Link href="/products?categoryId=9">Projector Accessories</Link>,
        key: "projector",
      },
      {
        label: <Link href="/products?categoryId=8">Monoculars</Link>,
        key: "monoculars",
      },
    ],
  },
  {
    label: <Link href="/blog">Blog</Link>,
    key: "blog",
  },
  {
    label: <Link href="/offers">Offers</Link>,
    key: "offers",
  },
];

export { navbarRoute, profileRoute, userProfileRoute, webSiteNavbarItems };
