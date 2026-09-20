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
import { ArrowRightOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";

interface CheckoutSummaryProps {
  activeStep?: number;
  onStepChange?: (step: 1 | 2 | 3) => void;
}

export default function CheckoutSummary({
  activeStep = 3,
  onStepChange,
}: CheckoutSummaryProps) {
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

  const handlePrimaryAction = async () => {
    if (activeStep === 1) {
      if (!checkoutFormData?.shippingAddressId) {
        errorNotification({ message: "Please select or add a shipping address first." });
        return;
      }
      onStepChange?.(2);
      return;
    }

    if (activeStep === 2) {
      if (!cart?.carts?.cartList || cart?.carts?.cartList.length === 0) {
        errorNotification({ message: "Your cart is empty. Please add items to checkout." });
        return;
      }
      onStepChange?.(3);
      return;
    }

    // Step 3 or Direct Submit
    await handleOrder();
  };

  const handleOrder = async () => {
    try {
      dispatch(setLoading({ save: true }));

      const validatedFields = onlineOrderValidationSchema.safeParse({
        totalQty: Number(totalQty) || 0,
        subTotal: String(subTotal || "0"),
        totalItemsDiscount: String(totalItemsDiscount || "0"),
        totalTax: String(totalTax || "0"),
        shippingCharge: String(shippingCharge || "0"),
        couponDiscount: String(couponDiscount || "0"),
        grandTotal: String(grandTotal || "0"),
        couponId: couponId ?? null,
        shippingAddressId: checkoutFormData?.shippingAddressId,
        paymentMethod: checkoutFormData?.paymentMethod,
        note: checkoutFormData?.note,
        termsAndConditions: Boolean(checkoutFormData?.termsAndConditions),
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

      successNotification({ message: res.message || "Order placed successfully!" });

      setTimeout(() => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
        dispatch(clearCart());
        dispatch(setCheckoutFormData({}));
        dispatch(setShippingAddress([]));
        dispatch(setShippingCharge({}));
        if (res.data?.paymentUrl) {
          window.location.href = res.data.paymentUrl;
        }
      }, 1000);
    } catch (err: any) {
      console.error("Order error:", err);
      dispatch(setLoading({ save: false }));
      errorNotification({ message: "Failed to process order" });
    }
  };

  const totalSavings = Number(totalItemsDiscount || 0) + Number(couponDiscount || 0);

  return (
    <div className="space-y-6">
      <div className="space-y-3.5">
        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-semibold">Total Items</span>
          <span className="text-xs font-black text-gray-900">{+totalQty || 0} items</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-semibold">Items Subtotal</span>
          <span className="text-xs font-black text-gray-900">
            {formatPrice(+subTotal + +totalDiscount)}
          </span>
        </div>

        {+totalItemsDiscount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span className="text-xs font-semibold">Item Savings</span>
            <span className="text-xs font-black">-{formatPrice(totalItemsDiscount)}</span>
          </div>
        )}

        {+couponDiscount > 0 && (
          <div className="flex justify-between items-center text-global-primary bg-global-primary/5 px-3 py-2 rounded-xl">
            <span className="text-xs font-bold">Coupon Savings</span>
            <span className="text-xs font-black">-{formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-semibold">Estimated Tax</span>
          <span className="text-xs font-black text-gray-900">+{formatPrice(totalTax || 0)}</span>
        </div>

        <div className="flex justify-between items-center text-gray-500">
          <span className="text-xs font-semibold">Shipping Charge</span>
          <span className="text-xs font-black text-gray-900">
            {Number(shippingCharge) > 0 ? (
              formatPrice(shippingCharge)
            ) : (
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Free / Included</span>
            )}
          </span>
        </div>
      </div>

      <Divider className="my-4 border-gray-100" />

      <div>
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
              Grand Total
            </div>
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              {formatPrice(grandTotal)}
            </div>
          </div>
          {totalSavings > 0 && (
            <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full mb-1">
              Saved {formatPrice(totalSavings)}
            </div>
          )}
        </div>

        <Button
          type="primary"
          size="large"
          className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] !bg-global-primary hover:!bg-global-hover border-none shadow-xl shadow-global-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          onClick={handlePrimaryAction}
          loading={loading?.save}
          disabled={loading?.save}
        >
          {activeStep === 1 && (
            <>
              <span>Review Order Items</span>
              <ArrowRightOutlined className="text-xs" />
            </>
          )}
          {activeStep === 2 && (
            <>
              <span>Proceed to Payment</span>
              <ArrowRightOutlined className="text-xs" />
            </>
          )}
          {activeStep === 3 && (
            <>
              <LockOutlined className="text-xs" />
              <span>Finalize & Place Order</span>
            </>
          )}
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
          <SafetyCertificateOutlined className="text-global-primary text-xs" />
          <span>Encrypted 256-Bit Checkout · Money-back Guarantee</span>
        </div>
      </div>
    </div>
  );
}
