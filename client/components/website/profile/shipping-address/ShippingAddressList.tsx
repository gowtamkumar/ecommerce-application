"use client";

import { ActionType } from "@/constants/constants";
import {
    deleteShippingAddress,
    getUserShippingAddresses,
    updateShippingAddress,
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
    FiCheck,
    FiCheckCircle,
    FiCopy,
    FiEdit2,
    FiHome,
    FiMail,
    FiMapPin,
    FiPhone,
    FiPlus,
    FiTrash2,
    FiUser
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
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [copiedAddressId, setCopiedAddressId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

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

  const handleSetDefault = async (item: DataType) => {
    const addressId = item.id || item.key || "";
    if (!addressId) return;

    setSettingDefaultId(addressId);
    try {
      const payload: any = {
        id: addressId,
        type: item.type || "Home",
        name: item.name,
        phoneNo: item.phoneNo,
        email: item.email || undefined,
        divisionId: item.division?.id || (item as any).divisionId,
        districtId: item.district?.id || (item as any).districtId,
        upazilaId: item.upazila?.id || (item as any).upazilaId || null,
        unionId: item.union?.id || (item as any).unionId || null,
        address: item.address,
        status: true,
      };
      const res = await updateShippingAddress(payload);
      if (res.success) {
        successNotification({ message: "Default delivery address updated" });
        fetchData();
      } else {
        errorNotification({
          message: res.message || "Failed to update default address",
        });
      }
    } catch (err: any) {
      errorNotification({
        message: err?.message || "Failed to set as default address",
      });
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleCopyAddress = (e: React.MouseEvent, item: DataType) => {
    e.stopPropagation();
    const addressId = item.id || item.key || "";
    const formatted = [
      item.address,
      item.union?.name,
      item.upazila?.name,
      item.district?.name,
      item.division?.name,
    ]
      .filter(Boolean)
      .join(", ");

    navigator.clipboard.writeText(formatted);
    setCopiedAddressId(addressId);
    setTimeout(() => setCopiedAddressId(null), 2000);
  };

  const handleCopyPhone = (e: React.MouseEvent, item: DataType) => {
    e.stopPropagation();
    const addressId = item.id || item.key || "";
    if (!item.phoneNo) return;
    navigator.clipboard.writeText(item.phoneNo);
    setCopiedPhoneId(addressId);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const getTypeBadge = (type: string) => {
    const t = type?.toLowerCase();
    if (t === "home") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
          <FiHome className="w-3.5 h-3.5 text-indigo-500" />
          <span>Home</span>
        </span>
      );
    }
    if (t === "office") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
          <FiBriefcase className="w-3.5 h-3.5 text-amber-500" />
          <span>Office</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200/70">
        <FiMapPin className="w-3.5 h-3.5 text-gray-500" />
        <span>{type || "Other"}</span>
      </span>
    );
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200/80">
              {shippingAddress.length} saved
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Manage your shipping destinations for fast and accurate order fulfillment
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
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4"
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
            const isSettingThisDefault = settingDefaultId === addressId;

            return (
              <div
                key={addressId}
                className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isDefault
                    ? "border-amber-400/90 ring-2 ring-amber-400/20 bg-amber-500/[0.015]"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div>
                  {/* Card Header: Type Badge, Default Tag & Action Icons */}
                  <div className="flex items-center justify-between gap-2 pb-3.5 mb-3.5 border-b border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTypeBadge(item.type)}

                      {isDefault && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <FiCheck className="text-xs" />
                          Default Address
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
                          className: "rounded-lg text-xs",
                        }}
                        cancelButtonProps={{ className: "rounded-lg text-xs" }}
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
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
                      <FiUser className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{item.name}</span>
                    </div>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FiPhone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="font-semibold text-gray-800">
                            {item.phoneNo}
                          </span>
                        </div>
                        {item.phoneNo && (
                          <Tooltip
                            title={
                              copiedPhoneId === addressId
                                ? "Copied!"
                                : "Copy phone"
                            }
                          >
                            <button
                              onClick={(e) => handleCopyPhone(e, item)}
                              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                            >
                              {copiedPhoneId === addressId ? (
                                <FiCheck className="text-emerald-500 text-xs" />
                              ) : (
                                <FiCopy className="text-xs" />
                              )}
                            </button>
                          </Tooltip>
                        )}
                      </div>

                      {item.email && (
                        <div className="flex items-center gap-2">
                          <FiMail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate text-gray-600 font-medium">
                            {item.email}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Address Box */}
                    <div className="mt-3 p-3.5 bg-gray-50/80 rounded-xl border border-gray-100 flex items-start justify-between gap-2.5 text-xs text-gray-700 leading-relaxed">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <FiMapPin className="w-4 h-4 text-global-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.address}
                          </p>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            {item.union?.name ? `${item.union.name}, ` : ""}
                            {item.upazila?.name ? `${item.upazila.name}, ` : ""}
                            {item.district?.name ? `${item.district.name}, ` : ""}
                            {item.division?.name || ""}
                          </p>
                        </div>
                      </div>

                      <Tooltip
                        title={
                          copiedAddressId === addressId
                            ? "Address copied!"
                            : "Copy full address"
                        }
                      >
                        <button
                          onClick={(e) => handleCopyAddress(e, item)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-lg transition-colors cursor-pointer shrink-0 mt-0.5"
                        >
                          {copiedAddressId === addressId ? (
                            <FiCheck className="text-emerald-500 text-xs" />
                          ) : (
                            <FiCopy className="text-xs" />
                          )}
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Set as Default or Default Badge */}
                <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                  {isDefault ? (
                    <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
                      <FiCheckCircle className="text-xs" />
                      Primary checkout destination
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(item)}
                      disabled={isSettingThisDefault}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:text-global-primary hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 transition-all cursor-pointer"
                    >
                      <FiCheck className="text-xs" />
                      <span>
                        {isSettingThisDefault
                          ? "Setting default..."
                          : "Set as Default"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-global-primary flex items-center justify-center mb-4 shadow-inner">
            <FiMapPin className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-gray-900 mb-1">
            No Addresses Saved Yet
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
            Add your primary shipping destination so you can enjoy fast 1-click
            checkout and hassle-free parcel deliveries.
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
