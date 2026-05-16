"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { saveOrder } from "@/lib/apis/orders";
import {
  errorNotification,
  successNotification,
} from "@/lib/utils/notification";
import { clearCart, selectCart } from "@/redux/features/cart/cartSlice";
import {
  selectCheckout,
  setCheckoutFormData,
  setShippingAddress,
  setShippingCharge,
} from "@/redux/features/checkout/checkoutSlice";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { onlineOrderValidationSchema } from "@/validation/order/onlineOrderValidation";
import { Button, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingOutlined, LockOutlined } from "@ant-design/icons";

export default function CheckoutSummary() {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const { formatPrice } = useCurrency();

  const {
    shippingCharge,
    totalItemsDiscount,
    couponDiscount,
    totalQty,
    totalTax,
    subTotal,
    totalDiscount,
    grandTotal,
    couponId,
  } = cart?.carts?.cartSummary || {};

  const { checkoutFormData } = checkout || {};
  const { loading } = global || {};

  const handleOrder = async () => {
    try {
      dispatch(setLoading({ save: true }));

      const validatedFields = onlineOrderValidationSchema.safeParse({
        totalQty,
        subTotal,
        totalItemsDiscount,
        totalTax,
        shippingCharge,
        couponDiscount,
        grandTotal,
        couponId,
        shippingAddressId: checkoutFormData?.shippingAddressId,
        paymentMethod: checkoutFormData.paymentMethod,
        note: checkoutFormData.note,
        termsAndConditions: checkoutFormData.termsAndConditions,
        orderItems: cart?.carts?.cartList,
      });

      if (!validatedFields.success) {
        validatedFields.error.issues.forEach((issue) => {
          errorNotification({ message: issue.message });
        });
        dispatch(setLoading({ save: false }));
        return;
      }

      const res = await saveOrder(validatedFields.data);

      if (res.message?.formErrors || !res.success) {
        errorNotification({ message: res.message });
        dispatch(setLoading({ save: false }));
        return;
      }

      successNotification({ message: res.message });

      setTimeout(() => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
        dispatch(clearCart());
        dispatch(setCheckoutFormData({}));
        dispatch(setShippingAddress([]));
        dispatch(setShippingCharge({}));
        if (res.data.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        }
      }, 1000);
    } catch (err: any) {
      console.error("Order error:", err);
      dispatch(setLoading({ save: false }));
      errorNotification({ message: "Failed to process order" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-bold uppercase tracking-widest">Total Quantity</span>
          <span className="text-sm font-black text-gray-900">{+totalQty || 0} Items</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
          <span className="text-sm font-black text-gray-900">{formatPrice(+subTotal + +totalDiscount)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Item Discount</span>
          <span className="text-sm font-black text-green-600">-{formatPrice(totalItemsDiscount)}</span>
        </div>

        {+couponDiscount > 0 && (
          <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Coupon Savings</span>
            <span className="text-sm font-black text-blue-600">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-bold uppercase tracking-widest">Tax (Estimated)</span>
          <span className="text-sm font-black text-gray-900">+{formatPrice(totalTax || 0)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-bold uppercase tracking-widest">Shipping Fee</span>
          <span className="text-sm font-black text-gray-900">{formatPrice(shippingCharge)}</span>
        </div>
      </div>

      <Divider className="my-6 border-gray-100" />

      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Grand Total</div>
            <div className="text-3xl font-black text-gray-900 tracking-tighter">
              {formatPrice(grandTotal)}
            </div>
          </div>
          <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full mb-2">
             Savings: {formatPrice(+totalItemsDiscount + +couponDiscount)}
          </div>
        </div>

        <Button
          type="primary"
          size="large"
          className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] !bg-gray-900 border-none shadow-xl shadow-gray-200"
          onClick={handleOrder}
          loading={loading.save}
          disabled={loading.save}
          icon={<LockOutlined />}
        >
          Finalize Order
        </Button>
        
        <p className="mt-4 text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">
           Tax and Shipping calculated at this step.
        </p>
      </div>
    </div>
  );
}
