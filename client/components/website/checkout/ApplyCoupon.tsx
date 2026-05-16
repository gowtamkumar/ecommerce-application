"use client";
import { getCartLists } from "@/lib/apis/cart";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import { selectCheckout, setCheckoutFormData } from "@/redux/features/checkout/checkoutSlice";
import { Button, Input, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TagOutlined } from "@ant-design/icons";

export default function ApplyCoupon() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);

  const handleCoupon = async () => {
    setLoading(true);

    const { checkoutFormData, shippingAddress } = checkout || {};
    const activeAddress = shippingAddress?.find((item: any) => item.id === checkoutFormData?.shippingAddressId);

    const coupon = await getCartLists({
      couponCode: data,
      districtId: activeAddress?.districtId
    });

    if (coupon.success) {
      dispatch(setCheckoutFormData({ ...checkoutFormData, couponCode: data }));
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
      <div className="flex flex-col gap-3">
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <TagOutlined />
            <span>Promotional Code</span>
         </div>
         <Space.Compact block size="large" className="w-full">
           <Input
             type="text"
             placeholder="SUMMER20..."
             className="!rounded-l-2xl h-12 text-sm font-bold uppercase tracking-widest border-2 border-gray-100 hover:!border-gray-900 focus:!border-gray-900 transition-all px-4"
             onChange={(value) => setData(value.target.value)}
           />
           <Button
             type="primary"
             onClick={handleCoupon}
             loading={loading}
             disabled={loading || !data}
             className="h-12 !rounded-r-2xl px-8 !bg-gray-900 border-none font-black text-xs uppercase tracking-widest"
           >
             APPLY
           </Button>
         </Space.Compact>
      </div>
    </div>
  );
}
