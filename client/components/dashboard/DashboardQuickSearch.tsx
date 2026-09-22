"use client";

import {
    AppstoreOutlined,
    CompassOutlined,
    DashboardOutlined,
    FileImageOutlined,
    HistoryOutlined,
    LineChartOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    SettingOutlined,
    ShopOutlined,
    ShoppingOutlined,
    TagOutlined,
    TeamOutlined,
    TruckOutlined
} from "@ant-design/icons";
import { Empty, Input, Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

interface SearchItem {
  key: string;
  title: string;
  description: string;
  category: "Navigation" | "Actions" | "Settings";
  path: string;
  icon: React.ReactNode;
  external?: boolean;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Navigation
  {
    key: "dash",
    title: "Dashboard Overview",
    description: "Main dashboard KPIs, sales charts, and recent activity",
    category: "Navigation",
    path: "/dashboard",
    icon: <DashboardOutlined className="text-blue-500" />,
  },
  {
    key: "orders",
    title: "Orders Management",
    description: "View customer orders, tracking, and fulfillment status",
    category: "Navigation",
    path: "/dashboard/orders",
    icon: <ShoppingOutlined className="text-emerald-500" />,
  },
  {
    key: "products",
    title: "Products Catalog",
    description: "Browse, filter, and manage all inventory items",
    category: "Navigation",
    path: "/dashboard/product",
    icon: <AppstoreOutlined className="text-indigo-500" />,
  },
  {
    key: "new-product",
    title: "Add New Product",
    description: "Create a new product with images, variants, and pricing",
    category: "Actions",
    path: "/dashboard/product/new",
    icon: <PlusCircleOutlined className="text-global-primary" />,
  },
  {
    key: "categories",
    title: "Product Categories",
    description: "Organize products into hierarchical categories",
    category: "Navigation",
    path: "/dashboard/category",
    icon: <AppstoreOutlined className="text-purple-500" />,
  },
  {
    key: "discounts",
    title: "Discounts & Promotions",
    description: "Manage sitewide discounts, product sales, and campaigns",
    category: "Navigation",
    path: "/dashboard/discounts",
    icon: <TagOutlined className="text-amber-500" />,
  },
  {
    key: "new-discount",
    title: "Create Discount",
    description: "Set up a new percentage or fixed discount rule",
    category: "Actions",
    path: "/dashboard/discounts/new",
    icon: <PlusCircleOutlined className="text-amber-600" />,
  },
  {
    key: "offers",
    title: "Special Offers",
    description: "Promotional landing pages and promotional bundles",
    category: "Navigation",
    path: "/offers",
    icon: <TagOutlined className="text-pink-500" />,
  },
  {
    key: "new-offer",
    title: "Create New Offer",
    description: "Design a new special deal or seasonal offer",
    category: "Actions",
    path: "/offers/new-offer",
    icon: <PlusCircleOutlined className="text-pink-600" />,
  },
  {
    key: "coupons",
    title: "Coupon Codes",
    description: "Voucher codes, cart-level rules, and discount thresholds",
    category: "Navigation",
    path: "/dashboard/coupons",
    icon: <TagOutlined className="text-rose-500" />,
  },
  {
    key: "customers",
    title: "Customers & Users",
    description: "Manage registered customers, roles, and buyer profiles",
    category: "Navigation",
    path: "/dashboard/customers",
    icon: <TeamOutlined className="text-teal-500" />,
  },
  {
    key: "returns",
    title: "Returns & Exchanges",
    description: "Customer return requests and status approvals",
    category: "Navigation",
    path: "/dashboard/return",
    icon: <ShoppingOutlined className="text-orange-500" />,
  },
  {
    key: "refunds",
    title: "Refunds",
    description: "Payment refund logs and processing",
    category: "Navigation",
    path: "/dashboard/refunds",
    icon: <ShoppingOutlined className="text-red-500" />,
  },
  {
    key: "shipping-charges",
    title: "Shipping Charges & Zones",
    description: "Delivery fees based on districts and regions",
    category: "Navigation",
    path: "/dashboard/shipping-charges",
    icon: <TruckOutlined className="text-sky-500" />,
  },
  {
    key: "reports",
    title: "Analytics & Reports",
    description: "Sales trends, top products, inventory valuations",
    category: "Navigation",
    path: "/dashboard/report",
    icon: <LineChartOutlined className="text-cyan-500" />,
  },
  {
    key: "audit-logs",
    title: "Audit & Activity Logs",
    description: "Staff actions, system event timestamps, and change history",
    category: "Navigation",
    path: "/dashboard/audit-logs",
    icon: <HistoryOutlined className="text-violet-500" />,
  },
  {
    key: "media",
    title: "Media Library",
    description: "Upload and manage product banners, brand assets, and files",
    category: "Navigation",
    path: "/dashboard/media",
    icon: <FileImageOutlined className="text-yellow-600" />,
  },
  {
    key: "settings",
    title: "General Site Settings",
    description: "Store name, currency, payment gateway credentials, and contact info",
    category: "Settings",
    path: "/dashboard/general-setting?tab=site_settings",
    icon: <SettingOutlined className="text-gray-600" />,
  },
  {
    key: "storefront",
    title: "Visit Live Store",
    description: "Open the customer-facing storefront in a new browser tab",
    category: "Actions",
    path: "/",
    icon: <ShopOutlined className="text-emerald-600" />,
    external: true,
  },
];

export default function DashboardQuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return SEARCH_ITEMS;
    const q = query.toLowerCase().trim();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    setQuery("");
    if (item.external) {
      window.open(item.path, "_blank");
    } else {
      router.push(item.path);
    }
  };

  return (
    <>
      {/* Trigger Button in Header (Desktop) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-gray-50/90 hover:bg-gray-100 border border-gray-200/80 hover:border-gray-300 rounded-xl transition-all cursor-pointer w-56 lg:w-72 shadow-2xs group text-left"
        aria-label="Quick Search"
      >
        <SearchOutlined className="text-gray-400 group-hover:text-global-primary transition-colors text-sm shrink-0" />
        <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors truncate flex-1 select-none">
          Search pages & actions...
        </span>
        <span className="flex items-center gap-0.5 text-[10px] font-semibold text-gray-400 bg-white px-1.5 py-0.5 rounded-md border border-gray-200 shadow-2xs shrink-0 select-none">
          <kbd>⌘</kbd>
          <kbd>K</kbd>
        </span>
      </button>

      {/* Trigger Button in Header (Mobile) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden w-9.5 h-9.5 inline-flex items-center justify-center rounded-xl bg-gray-50/80 hover:bg-gray-100 border border-gray-200/80 text-gray-600 hover:text-gray-900 transition-all cursor-pointer shadow-2xs"
        aria-label="Quick Search"
      >
        <SearchOutlined className="text-base" />
      </button>

      {/* Command Palette Modal */}
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
          setQuery("");
        }}
        footer={null}
        closable={false}
        width="92%"
        style={{ maxWidth: 580 }}
        centered
        destroyOnClose
        className="command-palette-modal [&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:overflow-hidden"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-white">
          <SearchOutlined className="text-gray-400 text-lg ml-2" />
          <Input
            autoFocus
            variant="borderless"
            placeholder="Type to search pages, catalog, settings..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-sm font-medium placeholder:text-gray-400 p-1"
          />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 rounded bg-gray-100 mr-1 select-none">
            ESC
          </span>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-gray-50">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span className="text-xs text-gray-400">
                    No results found for &ldquo;{query}&rdquo;
                  </span>
                }
              />
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100/80 group-hover:bg-white flex items-center justify-center text-base shrink-0 border border-gray-200/50 group-hover:border-gray-300 group-hover:shadow-xs transition-all">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 group-hover:text-global-primary transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider px-1.5 py-0.2 rounded bg-gray-100 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate m-0 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <CompassOutlined className="text-gray-300 group-hover:text-global-primary text-xs opacity-0 group-hover:opacity-100 transition-all shrink-0 mr-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with mouse or keyboard</span>
          <span className="font-semibold text-gray-500">
            {filteredItems.length} destinations
          </span>
        </div>
      </Modal>
    </>
  );
}
