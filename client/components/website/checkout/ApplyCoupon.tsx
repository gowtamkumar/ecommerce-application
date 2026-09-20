"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { getCartLists } from "@/lib/apis/cart";
import { errorNotification, successNotification } from "@/lib/utils/notification";
import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
import { selectCheckout, setCheckoutFormData } from "@/redux/features/checkout/checkoutSlice";
import { CheckCircleFilled, CloseCircleOutlined, TagOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
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
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
          <span className="flex items-center gap-2">
            <TagOutlined className="text-global-primary" />
            <span>Promotional Code</span>
          </span>
          {isCouponApplied && (
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
              <CheckCircleFilled className="text-xs" /> Applied
            </span>
          )}
        </div>

        {isCouponApplied ? (
          <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm">
                <TagOutlined />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                    {appliedCouponCode || "COUPON"}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <p className="text-[11px] font-medium text-emerald-700">
                    Saved {formatPrice(couponDiscount)} on your order
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              disabled={loading}
              className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-50"
            >
              <CloseCircleOutlined className="text-xs" />
              <span>Remove</span>
            </button>
          </div>
        ) : (
          <Space.Compact block size="large" className="w-full">
            <Input
              type="text"
              placeholder="e.g. SAVE20"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              onPressEnter={handleApplyCoupon}
              className="!rounded-l-2xl h-12 text-xs font-bold uppercase tracking-widest border border-gray-200 hover:!border-gray-900 focus:!border-gray-900 transition-all px-4"
            />
            <Button
              type="primary"
              onClick={handleApplyCoupon}
              loading={loading}
              disabled={loading || !couponInput.trim()}
              className="h-12 !rounded-r-2xl px-6 !bg-global-primary hover:!bg-global-hover border-none font-black text-xs uppercase tracking-widest transition-all"
            >
              Apply
            </Button>
          </Space.Compact>
        )}
      </div>
    </div>
  );
}
