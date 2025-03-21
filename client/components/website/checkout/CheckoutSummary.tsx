/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { saveOrder } from "@/lib/apis/orders";
import { cartCalculationFun } from "@/lib/utils/cartCalculationFun";
import {
  clearCart,
  selectCart,
  setCartResult,
} from "@/redux/features/cart/cartSlice";
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
  setResponse,
} from "@/redux/features/global/globalSlice";
import { onlineOrderValidationSchema } from "@/validation/order/onlineOrderValidation";
import { Button } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutSummary() {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);
  const route = useRouter();

  const { total, totalDiscount, totalQty, totalTax, subTotal } =
    cart.cartResult || {};
  const { shippingCharge, checkoutFormData } = checkout || {};
  const { loading } = global || {};
  console.log("checkout", checkout);
  

  useEffect(() => {
    async function calculateCart() {
      const result = await cartCalculationFun(cart.carts);
      dispatch(setCartResult(result));
    }

    calculateCart();
  }, [cart.carts]);

  // State for form inputs
  const handleOrder = async () => {
    try {
      dispatch(setLoading({ save: true }));
      const validatedFields = onlineOrderValidationSchema.safeParse({
        orderItems: cart.carts,
        subTotal: +total,
        totalTax: +totalTax,
        shippingCharge: +shippingCharge?.shippingCharge || 0,
        discountAmount: +totalDiscount,
        paymentMethod: checkoutFormData.paymentMethod,
        shippingAddressId: checkoutFormData?.shippingAddressId,
      });

      if (!validatedFields.success) {
        const formattedErrors = validatedFields.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        dispatch(setLoading({ save: false }));
        return {
          errors: formattedErrors,
        };
      }

      const res = await saveOrder(validatedFields.data);

      if (res.message?.formErrors) {
        dispatch(setLoading({ save: false }));
        return;
      }

      if (!res.success) {
        dispatch(setResponse({ type: "error", message: res.message }));
        return;
      } else {
        dispatch(
          setResponse({ type: "success", message: "Order successfully" })
        );
      }

      setTimeout(async () => {
        dispatch(setLoading({ save: false }));
        dispatch(setAction({}));
        dispatch(setResponse({}));
        dispatch(clearCart());
        dispatch(setCheckoutFormData({}));
        dispatch(setShippingAddress([]));
        dispatch(setShippingCharge({}));
        // route.push("/");
      }, 1000);
    } catch (err: any) { }
  };

  return (
    <div className="bg-white rounded-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Checkout Summary</h2>
      </div>

      <div className="p-4 rounded">
        <div className="flex justify-between">
          <span>Total Quantity</span>
          <span>{+totalQty}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Discount</span>
          <span>{(+totalDiscount).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Tax</span>
          <span>{(+totalTax).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping Cost</span>
          <span>{(+shippingCharge?.shippingCharge || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-2xl">৳{(+total).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">Total payable</span>
          <span className="font-bold text-2xl">
            ৳{(+subTotal + (+shippingCharge?.shippingCharge || 0)).toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        className="w-full"
        onClick={handleOrder}
        loading={loading.save}
        disabled={loading.save}
      >
        <span>Confirm Order</span>
        {(+subTotal + (+shippingCharge?.shippingCharge || 0)).toFixed(2)}
        TK.
      </Button>
    </div>
  );
}
