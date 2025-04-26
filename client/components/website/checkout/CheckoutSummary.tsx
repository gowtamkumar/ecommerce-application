/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { saveOrder } from "@/lib/apis/orders";
import { cartCalculationFun } from "@/lib/utils/cartCalculationFun";
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
  setResponse,
} from "@/redux/features/global/globalSlice";
import { onlineOrderValidationSchema } from "@/validation/order/onlineOrderValidation";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutSummary() {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const checkout = useSelector(selectCheckout);

  const {
    shippingCharge,
    totalItemsDiscount,
    totalDiscount,
    couponDiscount,
    totalQty,
    totalTax,
    subTotal,
    grandTotal,
    couponId,
  } = cart?.carts?.cartSummary || {};

  const { checkoutFormData } = checkout || {};
  const { loading } = global || {};

  // useEffect(() => {
  //   async function calculateCart() {
  //     const result = await cartCalculationFun(cart.carts);
  //     dispatch(setCartResult(result));
  //   }
  //   calculateCart();
  // }, [cart.carts]);

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
        const formattedErrors = validatedFields.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
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
        dispatch(setResponse({}));
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
      dispatch(
        setResponse({ type: "error", message: "Failed to process order" })
      );
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
          <span>{totalDiscount}</span>
        </div>
        {/* 
        <div className="flex justify-between">
          <span>Total Tax</span>
          <span>{totalTax}</span>
        </div> */}

        <div className="flex justify-between">
          <span>Shipping Cost</span>
          <span>{shippingCharge}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-2xl">৳{(+subTotal).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">Total payable</span>
          <span className="font-bold text-2xl">৳{grandTotal}</span>
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
