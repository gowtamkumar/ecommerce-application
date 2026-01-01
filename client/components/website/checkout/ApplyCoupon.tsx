"use client";
import { getCartLists } from "@/lib/apis/cart";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import { Button, Input, Space } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function ApplyCoupon() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCoupon = async () => {
    setLoading(true);

    const coupon = await getCartLists({ couponCode: data, shippingCost: 0 });    

    if (coupon.success) {
      successNotification({ message: coupon.message });
      dispatch(replaceCart(coupon.data));
    }

    if (!coupon.success) {
      errorNotification({ message: coupon.message });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full">
      <Space.Compact block size="large" className="w-full">
        <Input
          type="text"
          placeholder="Enter Coupon Code"
          className="hover:!border-global-primary/50 focus:!border-global-primary rounded-l-xl"
          onChange={(value) => setData(value.target.value)}
          prefix={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
        <Button
          type="primary"
          onClick={handleCoupon}
          loading={loading}
          disabled={loading || !data}
          className="!bg-global-primary hover:!bg-global-hover !border-global-primary rounded-r-xl px-6"
        >
          Apply
        </Button>
      </Space.Compact>
    </div>
  );
}
