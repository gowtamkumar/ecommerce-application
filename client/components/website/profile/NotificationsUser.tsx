"use client";

import {
    clearNotifications,
    deleteNotification,
    getNotifications,
    readAllNotifications,
    readNotification,
} from "@/lib/apis/notification";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import {
    Modal,
    Pagination,
    Popconfirm,
    Skeleton,
    Tooltip,
} from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
    FiAlertCircle,
    FiArrowRight,
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiExternalLink,
    FiFilter,
    FiPackage,
    FiShield,
    FiTag,
    FiTrash2,
    FiTruck,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

dayjs.extend(relativeTime);

type FilterCategory = "all" | "unread" | "orders" | "offers";

export default function NotificationsUser() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Overall counts for category tabs
  const [counts, setCounts] = useState({
    all: 0,
    unread: 0,
    orders: 0,
    offers: 0,
  });

  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const router = useRouter();

  // 1. Fetch summary counts for the category chips
  const fetchCounts = useCallback(async () => {
    try {
      const res = await getNotifications();
      if (res?.data) {
        const all: any[] = res.data;
        setCounts({
          all: res.totalItem ?? res.total ?? all.length,
          unread: all.filter((n) => !n.isRead).length,
          orders: all.filter(
            (n) => n.orderId || (n.type && n.type.toLowerCase().includes("order"))
          ).length,
          offers: all.filter(
            (n) =>
              n.offerUrl ||
              (n.type &&
                (n.type.toLowerCase().includes("offer") ||
                  n.type.toLowerCase().includes("promo") ||
                  n.type.toLowerCase().includes("coupon")))
          ).length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch notification counts", err);
    }
  }, []);

  // 2. Fetch paginated notifications from the server
  const fetchPaginatedData = useCallback(
    async (page: number, limit: number, category: FilterCategory) => {
      dispatch(setLoading({ notification: true }));
      try {
        const params: any = {
          page,
          limit,
        };
        if (category === "unread") {
          params.status = "unread";
        } else if (category === "orders") {
          params.type = "Order";
        } else if (category === "offers") {
          params.type = "Offer";
        }

        const res = await getNotifications(params);
        if (res?.data) {
          setNotifications(res.data);
          setTotalItems(res.totalItem ?? res.total ?? res.data.length);
        }
      } catch (error) {
        console.error("Failed to load paginated notifications", error);
      } finally {
        dispatch(setLoading({ notification: false }));
      }
    },
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Load page on pagination or category change
  useEffect(() => {
    fetchPaginatedData(currentPage, pageSize, activeCategory);
  }, [fetchPaginatedData, currentPage, pageSize, activeCategory]);

  // Handle Tab Switch
  const handleCategoryChange = (cat: FilterCategory) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  // Mark single notification as read
  const handleMarkAsRead = async (item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.isRead) return;

    try {
      const res = await readNotification({ id: item.id });
      if (res?.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        setCounts((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      const res = await readAllNotifications();
      if (res?.success) {
        successNotification({ message: "All notifications marked as read" });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setCounts((prev) => ({ ...prev, unread: 0 }));
      } else {
        const unreadList = notifications.filter((n) => !n.isRead);
        await Promise.all(unreadList.map((n) => readNotification({ id: n.id })));
        successNotification({ message: "All notifications marked as read" });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setCounts((prev) => ({ ...prev, unread: 0 }));
      }
    } catch (err) {
      console.error(err);
      errorNotification({ message: "Could not mark all as read" });
    }
  };

  // Delete single notification
  const handleDeleteNotification = async (id: string | number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await deleteNotification(String(id));
      if (res?.success) {
        successNotification({ message: "Notification removed" });
        fetchPaginatedData(currentPage, pageSize, activeCategory);
        fetchCounts();
        if (selectedNotification?.id === id) {
          setSelectedNotification(null);
        }
      }
    } catch (err) {
      console.error(err);
      errorNotification({ message: "Failed to remove notification" });
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      const res = await clearNotifications();
      if (res?.success) {
        successNotification({ message: "All notifications cleared" });
        setNotifications([]);
        setTotalItems(0);
        setSelectedNotification(null);
        setCounts({ all: 0, unread: 0, orders: 0, offers: 0 });
      }
    } catch (err) {
      console.error(err);
      errorNotification({ message: "Failed to clear notifications" });
    }
  };

  // Open detail modal
  const handleCardClick = (item: any) => {
    setSelectedNotification(item);
    if (!item.isRead) {
      handleMarkAsRead(item);
    }
  };

  // Follow notification link
  const handleNavigate = (item: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (item.orderId) {
      router.push(`/profile?tab=track_order&orderId=${item.orderId}`);
      return;
    }
    if (item.offerUrl) {
      router.push(item.offerUrl);
      return;
    }
    handleCardClick(item);
  };

  // Helper for notification type visuals
  const getTypeMeta = (item: any) => {
    const typeStr = (item.type || "").toLowerCase();
    if (typeStr.includes("cancel")) {
      return {
        icon: <FiAlertCircle className="w-4 h-4 text-rose-600" />,
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        pillText: "Canceled",
        iconBg: "bg-rose-100/80 text-rose-600",
      };
    }
    if (typeStr.includes("ship")) {
      return {
        icon: <FiTruck className="w-4 h-4 text-sky-600" />,
        badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
        pillText: "Shipping",
        iconBg: "bg-sky-100/80 text-sky-600",
      };
    }
    if (typeStr.includes("deliver")) {
      return {
        icon: <FiCheckCircle className="w-4 h-4 text-emerald-600" />,
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pillText: "Delivered",
        iconBg: "bg-emerald-100/80 text-emerald-600",
      };
    }
    if (item.orderId || typeStr.includes("order")) {
      return {
        icon: <FiPackage className="w-4 h-4 text-indigo-600" />,
        badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        pillText: item.orderId ? `Order #${item.orderId}` : "Order Update",
        iconBg: "bg-indigo-100/80 text-indigo-600",
      };
    }
    if (
      item.offerUrl ||
      typeStr.includes("offer") ||
      typeStr.includes("promo") ||
      typeStr.includes("coupon")
    ) {
      return {
        icon: <FiTag className="w-4 h-4 text-amber-600" />,
        badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
        pillText: "Offer & Promo",
        iconBg: "bg-amber-100/80 text-amber-600",
      };
    }
    if (
      typeStr.includes("security") ||
      typeStr.includes("password") ||
      typeStr.includes("auth")
    ) {
      return {
        icon: <FiShield className="w-4 h-4 text-violet-600" />,
        badgeBg: "bg-violet-50 text-violet-700 border-violet-200",
        pillText: "Security",
        iconBg: "bg-violet-100/80 text-violet-600",
      };
    }
    return {
      icon: <FiBell className="w-4 h-4 text-slate-600" />,
      badgeBg: "bg-slate-50 text-slate-700 border-slate-200",
      pillText: "Notice",
      iconBg: "bg-slate-100/80 text-slate-600",
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Notification Center
            </h1>
            {counts.unread > 0 ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                {counts.unread} new
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                All caught up
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time updates on your orders, security alerts, and promotional announcements.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {counts.unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-amber-700 bg-gray-50 hover:bg-amber-50 rounded-xl border border-gray-200 hover:border-amber-300 transition-all cursor-pointer"
            >
              <FiCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Mark all read</span>
            </button>
          )}

          {counts.all > 0 && (
            <Popconfirm
              title="Clear all notifications?"
              description="Are you sure you want to delete all notifications from your history?"
              onConfirm={handleClearAll}
              okText="Yes, clear"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-50 rounded-xl border border-rose-200/60 transition-all cursor-pointer">
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => handleCategoryChange("all")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-100"
          }`}
        >
          <FiFilter className="w-3.5 h-3.5" />
          <span>All Updates</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
              activeCategory === "all"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => handleCategoryChange("unread")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === "unread"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-100"
          }`}
        >
          <span>Unread</span>
          {counts.unread > 0 ? (
            <span className="px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-amber-500 text-white">
              {counts.unread}
            </span>
          ) : (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                activeCategory === "unread"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              0
            </span>
          )}
        </button>

        <button
          onClick={() => handleCategoryChange("orders")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === "orders"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-100"
          }`}
        >
          <FiPackage className="w-3.5 h-3.5 text-indigo-500" />
          <span>Orders & Delivery</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
              activeCategory === "orders"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {counts.orders}
          </span>
        </button>

        <button
          onClick={() => handleCategoryChange("offers")}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeCategory === "offers"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-100"
          }`}
        >
          <FiTag className="w-3.5 h-3.5 text-amber-500" />
          <span>Offers & Deals</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
              activeCategory === "offers"
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {counts.offers}
          </span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {global.loading.notification ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs"
            >
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : !notifications.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4">
            <FiBell className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            {activeCategory === "unread"
              ? "You're all caught up!"
              : "No notifications found"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            {activeCategory === "unread"
              ? "All your notifications have been marked as read. Check back later for new updates."
              : "There are no notifications matching your current category filter."}
          </p>
          {activeCategory !== "all" && (
            <button
              onClick={() => handleCategoryChange("all")}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
            >
              <span>View all notifications</span>
              <FiArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item: any) => {
            const meta = getTypeMeta(item);
            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  item.isRead
                    ? "bg-white border-gray-100 hover:border-gray-200 hover:shadow-xs"
                    : "bg-amber-500/[0.02] border-amber-200/70 hover:border-amber-300 hover:shadow-sm"
                }`}
              >
                {/* Left accent marker for unread */}
                {!item.isRead && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-amber-500 rounded-r-full" />
                )}

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Category / Status Icon */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition ${meta.iconBg}`}
                  >
                    {meta.icon}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold border ${meta.badgeBg}`}
                        >
                          {meta.pillText}
                        </span>
                        <h4
                          className={`text-sm sm:text-base tracking-tight truncate ${
                            item.isRead
                              ? "font-semibold text-gray-800"
                              : "font-black text-gray-900"
                          }`}
                        >
                          {item.title}
                        </h4>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                      </div>

                      {/* Timestamp */}
                      <Tooltip
                        title={dayjs(item.createdAt).format("MMM D, YYYY h:mm A")}
                      >
                        <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium shrink-0">
                          <FiClock className="w-3 h-3" />
                          {dayjs(item.createdAt).fromNow()}
                        </span>
                      </Tooltip>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                      {item.message}
                    </p>

                    {/* Bottom Action Strip */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-50 text-xs">
                      <div className="flex items-center gap-2">
                        {item.orderId ? (
                          <button
                            onClick={(e) => handleNavigate(item, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/80 transition cursor-pointer"
                          >
                            <FiPackage className="w-3.5 h-3.5" />
                            <span>Track Order #{item.orderId}</span>
                            <FiArrowRight className="w-3 h-3" />
                          </button>
                        ) : item.offerUrl ? (
                          <button
                            onClick={(e) => handleNavigate(item, e)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100/80 transition cursor-pointer"
                          >
                            <FiTag className="w-3.5 h-3.5" />
                            <span>View Offer</span>
                            <FiExternalLink className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400">
                            Click to view full message
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                        {!item.isRead && (
                          <Tooltip title="Mark as read">
                            <button
                              onClick={(e) => handleMarkAsRead(item, e)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        )}

                        <Popconfirm
                          title="Delete notification?"
                          description="Are you sure you want to remove this notification?"
                          onConfirm={(e) => handleDeleteNotification(item.id, e as any)}
                          onCancel={(e) => e?.stopPropagation()}
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                        >
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Server Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <span className="text-xs text-gray-500 font-medium order-2 sm:order-1">
            Total {totalItems} {totalItems === 1 ? "notification" : "notifications"}
          </span>
          <div className="order-1 sm:order-2">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={(page, newSize) => {
                setCurrentPage(page);
                if (newSize && newSize !== pageSize) {
                  setPageSize(newSize);
                }
              }}
              showSizeChanger
              pageSizeOptions={["8", "16", "24", "48"]}
            />
          </div>
        </div>
      )}

      {/* Notification Details Modal */}
      <Modal
        title={null}
        open={!!selectedNotification}
        onCancel={() => setSelectedNotification(null)}
        footer={null}
        centered
        width={500}
        style={{ maxWidth: "calc(100vw - 32px)" }}
      >
        {selectedNotification && (() => {
          const modalMeta = getTypeMeta(selectedNotification);
          return (
            <div className="pt-2 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${modalMeta.iconBg}`}
                >
                  {modalMeta.icon}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${modalMeta.badgeBg}`}
                    >
                      {modalMeta.pillText}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {dayjs(selectedNotification.createdAt).format(
                        "MMMM D, YYYY · h:mm A"
                      )}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {selectedNotification.title}
                  </h3>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Popconfirm
                  title="Delete notification?"
                  onConfirm={() => handleDeleteNotification(selectedNotification.id)}
                  okText="Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer">
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </Popconfirm>

                <div className="flex items-center gap-2">
                  {selectedNotification.orderId ? (
                    <button
                      onClick={() => {
                        setSelectedNotification(null);
                        router.push(
                          `/profile?tab=track_order&orderId=${selectedNotification.orderId}`
                        );
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition shadow-sm cursor-pointer"
                    >
                      <FiPackage className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </button>
                  ) : selectedNotification.offerUrl ? (
                    <button
                      onClick={() => {
                        setSelectedNotification(null);
                        router.push(selectedNotification.offerUrl);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition shadow-sm cursor-pointer"
                    >
                      <FiExternalLink className="w-3.5 h-3.5" />
                      <span>View Offer</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
