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
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

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

  // State for form inputs
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
        orderItems: cart?.carts?.cartList,
      });

      if (!validatedFields.success) {
        const formattedErrors = validatedFields.error.issues.map((issue) => {
          errorNotification({ message: issue.message });
          return {
            path: issue.path.join("."),
            message: issue.message,
          };
        });

        dispatch(setLoading({ save: false }));
        return { errors: formattedErrors };
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
        console.log("res.data.", res.data);

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

  // const handleOrder = async () => {
  //   try {
  //     dispatch(setLoading({ save: true }));
  //     const validatedFields = onlineOrderValidationSchema.safeParse({
  //       totalQty,
  //       subTotal,
  //       totalItemsDiscount,
  //       totalTax,
  //       shippingCharge,
  //       couponDiscount,
  //       grandTotal,
  //       couponId,
  //       shippingAddressId: checkoutFormData?.shippingAddressId,
  //       paymentMethod: checkoutFormData.paymentMethod,
  //       note: checkoutFormData.note,
  //       orderItems: cart?.carts?.cartList,
  //     });

  //     console.log("validatedFields", validatedFields);

  //     if (!validatedFields.success) {
  //       const formattedErrors = validatedFields.error.issues.map((issue) => ({
  //         path: issue.path.join("."),
  //         message: issue.message,
  //       }));

  //       dispatch(setLoading({ save: false }));
  //       return {
  //         errors: formattedErrors,
  //       };
  //     }

  //     const res = await saveOrder(validatedFields.data);
  //     console.log("res", res);

  //     if (res.message?.formErrors) {
  //       dispatch(setLoading({ save: false }));
  //       return;
  //     }

  //     if (!res.success) {
  //       dispatch(setLoading({ save: false }));
  //       dispatch(setResponse({ type: "error", message: res.message }));
  //       return;
  //     } else {
  //       dispatch(
  //         setResponse({ type: "success", message: "Order successfully" })
  //       );
  //     }

  //     setTimeout(async () => {
  //       dispatch(setLoading({ save: false }));
  //       dispatch(setAction({}));
  //       dispatch(setResponse({}));
  //       dispatch(clearCart());
  //       dispatch(setCheckoutFormData({}));
  //       dispatch(setShippingAddress([]));
  //       dispatch(setShippingCharge({}));
  //       if (res.data.paymentUrl) {
  //         window.location.href = res.data.paymentUrl;
  //       }
  //       // route.push("/");
  //     }, 1000);
  //   } catch (err: any) { }
  // };

  return (
    <div className="space-y-4">
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Total Quantity</span>
          <span className="font-medium text-gray-900">{+totalQty || 0}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(+subTotal + +totalDiscount)}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span className="text-green-600">- {formatPrice(totalItemsDiscount)}</span>
        </div>

        {+couponDiscount > 0 && (
          <div className="flex justify-between">
            <span>Coupon Discount</span>
            <span className="text-green-600">- {formatPrice(couponDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping Cost</span>
          <span className="font-medium text-gray-900">{formatPrice(shippingCharge)}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-end mb-6">
          <span className="text-base font-bold text-gray-800">Total Payable</span>
          <span className="text-2xl font-bold text-blue-600">{formatPrice(grandTotal)}</span>
        </div>

        <Button
          type="primary"
          size="large"
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 border-none shadow-md hover:shadow-lg transition-all rounded-xl"
          onClick={handleOrder}
          loading={loading.save}
          disabled={loading.save}
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
