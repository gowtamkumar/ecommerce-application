"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { getCartLists } from "@/lib/apis/cart";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import { selectCheckout, setCheckoutFormData } from "@/redux/features/checkout/checkoutSlice";
import { CheckCircleFilled, CloseCircleOutlined, TagOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ApplyCoupon() {
  const [couponInput, setCouponInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const cart = useSelector(selectCart);
  const { formatPrice } = useCurrency();

  const { checkoutFormData, shippingAddress } = checkout || {};
  const couponDiscount = Number(cart?.carts?.cartSummary?.couponDiscount || 0);
  const appliedCouponCode = checkoutFormData?.couponCode;
  const isCouponApplied = couponDiscount > 0 || Boolean(appliedCouponCode);

  const activeAddress = shippingAddress?.find(
    (item: any) => item.id === checkoutFormData?.shippingAddressId
  );

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setLoading(true);

    try {
      const res = await getCartLists({
        couponCode: couponInput.trim(),
        districtId: activeAddress?.districtId,
      });

      if (res.success) {
        dispatch(
          setCheckoutFormData({
            ...checkoutFormData,
            couponCode: couponInput.trim(),
          })
        );
        dispatch(replaceCart(res.data));
        successNotification({ message: res.message || "Coupon applied successfully!" });
        setCouponInput("");
      } else {
        errorNotification({ message: res.message || "Failed to apply coupon" });
      }
    } catch (err: any) {
      errorNotification({ message: err?.message || "Error applying coupon" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setLoading(true);
    try {
      const res = await getCartLists({
        districtId: activeAddress?.districtId,
      });

      if (res.success) {
        dispatch(
          setCheckoutFormData({
            ...checkoutFormData,
            couponCode: "",
          })
        );
        dispatch(replaceCart(res.data));
        successNotification({ message: "Coupon removed" });
      } else {
        errorNotification({ message: res.message || "Failed to remove coupon" });
      }
    } catch (err: any) {
      errorNotification({ message: err?.message || "Error removing coupon" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <TagOutlined className="text-global-primary text-sm" />
            <span>Promo Code</span>
          </span>
          {isCouponApplied ? (
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircleFilled className="text-xs" /> Applied
            </span>
          ) : (
            <span className="text-[11px] text-gray-400 font-medium">
              Have a voucher?
            </span>
          )}
        </div>

        {isCouponApplied ? (
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-linear-to-r from-emerald-50/90 via-emerald-50/50 to-white p-3.5 shadow-xs transition-all duration-300">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20">
                  <TagOutlined className="text-sm" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-wider font-mono bg-white px-2 py-0.5 rounded-md border border-emerald-200/80 shadow-2xs truncate">
                      {appliedCouponCode || "COUPON"}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      Saved <span className="font-black">{formatPrice(couponDiscount)}</span> on your order
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleRemoveCoupon}
                disabled={loading}
                className="shrink-0 text-xs font-bold text-gray-400 hover:text-red-600 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-red-50 active:scale-95 disabled:opacity-50"
              >
                <CloseCircleOutlined className="text-xs" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative flex items-center bg-gray-50/90 hover:bg-white focus-within:bg-white border border-gray-200 focus-within:border-global-primary focus-within:ring-4 focus-within:ring-global-primary/10 rounded-2xl p-1.5 transition-all duration-200 shadow-2xs">
            <div className="pl-3 pr-2 text-gray-400">
              <TagOutlined className="text-sm" />
            </div>
            <input
              type="text"
              placeholder="Enter discount code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCoupon();
                }
              }}
              className="w-full bg-transparent text-xs font-bold uppercase tracking-wider text-gray-900 placeholder:normal-case placeholder:font-normal placeholder:text-gray-400 focus:outline-hidden py-2"
            />
            {couponInput && (
              <button
                type="button"
                onClick={() => setCouponInput("")}
                className="text-gray-400 hover:text-gray-600 p-1 mr-1 transition-colors"
                title="Clear"
              >
                <CloseCircleOutlined className="text-xs" />
              </button>
            )}
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={loading || !couponInput.trim()}
              className="shrink-0 px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-200 bg-global-primary hover:bg-global-hover text-white shadow-sm shadow-global-primary/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Applying</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
