"use client";

import { ActionType } from "@/constants/constants";
import {
    deleteShippingAddress,
    getUserShippingAddresses,
} from "@/lib/apis/shipping-address";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import {
    selectGlobal,
    setAction,
} from "@/redux/features/global/globalSlice";
import { Popconfirm, Skeleton, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
    FiBriefcase,
    FiEdit2,
    FiHome,
    FiMail,
    FiMapPin,
    FiPhone,
    FiPlus,
    FiTrash2,
    FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import AddShippingAddress from "./AddShippingAddress";

interface DataType {
  id: string;
  key?: string;
  type: string;
  name: string;
  phoneNo: string;
  email: string;
  division: any;
  user: any;
  district: any;
  upazila: any;
  union: any;
  address: string;
  status: boolean;
}

export default function ShippingAddressList() {
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<DataType[]>([]);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserShippingAddresses();
      if (res.success) {
        setShippingAddress(res.data || []);
      }
    } catch (error: any) {
      errorNotification({ message: error.message || "Failed to load addresses" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [global.action]);

  const handleDelete = async (id: string) => {
    try {
      await deleteShippingAddress(id);
      successNotification({ message: "Address deleted successfully" });
      fetchData();
    } catch (error: any) {
      errorNotification({ message: error.message || "Failed to delete address" });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "home":
        return <FiHome className="w-3.5 h-3.5" />;
      case "office":
        return <FiBriefcase className="w-3.5 h-3.5" />;
      default:
        return <FiMapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              Delivery Addresses
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200/80">
              {shippingAddress.length} saved
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your delivery destinations for faster checkout
          </p>
        </div>

        <button
          onClick={() =>
            dispatch(
              setAction({
                userShippingAddress: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="inline-flex items-center justify-center gap-2 px-5 h-11 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity cursor-pointer w-full sm:w-auto"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* ── Loading Skeleton ── */}
      {loading && !shippingAddress.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton.Button active shape="round" size="small" />
                <Skeleton.Button active shape="circle" size="small" />
              </div>
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : shippingAddress.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {shippingAddress.map((item) => {
            const isDefault = Boolean(item.status);
            const addressId = item.id || item.key || "";

            return (
              <div
                key={addressId}
                className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isDefault
                    ? "border-amber-300 ring-1 ring-amber-200/70"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div>
                  {/* Card Header: Type Badge, Default Tag & Action Icons */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        {getTypeIcon(item.type)}
                        <span>{item.type || "Address"}</span>
                      </span>

                      {isDefault && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Default
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1">
                      <Tooltip title="Edit Address">
                        <button
                          onClick={() =>
                            dispatch(
                              setAction({
                                userShippingAddress: true,
                                type: ActionType.UPDATE,
                                payload: item,
                              })
                            )
                          }
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          aria-label="Edit Address"
                        >
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>

                      <Popconfirm
                        title="Delete Address"
                        description="Are you sure you want to remove this address?"
                        onConfirm={() => handleDelete(addressId)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{
                          danger: true,
                          className: "!rounded-lg !text-xs",
                        }}
                        cancelButtonProps={{ className: "!rounded-lg !text-xs" }}
                      >
                        <Tooltip title="Delete Address">
                          <button
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            aria-label="Delete Address"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </div>

                  {/* Recipient Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
                      <FiUser className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{item.name}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-2.5">
                        <FiPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="font-medium text-gray-700">
                          {item.phoneNo}
                        </span>
                      </div>

                      {item.email && (
                        <div className="flex items-center gap-2.5">
                          <FiMail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate text-gray-600">
                            {item.email}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Address Box */}
                    <div className="mt-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100 flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                      <FiMapPin className="w-4 h-4 text-global-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{item.address}</p>
                        <p className="text-gray-500 text-[11px] mt-0.5">
                          {item.union?.name ? `${item.union.name}, ` : ""}
                          {item.upazila?.name ? `${item.upazila.name}, ` : ""}
                          {item.district?.name ? `${item.district.name}, ` : ""}
                          {item.division?.name || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-global-primary flex items-center justify-center mb-4">
            <FiMapPin className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-1">
            No Addresses Saved Yet
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mb-6">
            Add your primary shipping destination so you can checkout quickly
            and track shipments easily.
          </p>
          <button
            onClick={() =>
              dispatch(
                setAction({
                  userShippingAddress: true,
                  type: ActionType.CREATE,
                })
              )
            }
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-global-primary text-white text-xs font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Your First Address</span>
          </button>
        </div>
      )}

      <AddShippingAddress />
    </div>
  );
}
