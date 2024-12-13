"use client";
import { saveOrder } from "@/lib/apis/orders";
import { cartCalculationFun, CartResult } from "@/lib/utils/cartCalculationFun";
import { clearCart, selectCart } from "@/redux/features/cart/cartSlice";
import {
  selectGlobal,
  setAction,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";
import { orderValidationSchema } from "@/validation";
import { onlineOrderValidationSchema } from "@/validation/order/onlineOrderValidation";
import { Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutSummary({
  checkoutFormData,
  shippingCharge,
  setCheckoutFormData,
  setShippingAddress,
  setShippingCharge,
}: any) {
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const [cartResult, setCartResult] = useState<CartResult>({
    total: 0,
    totalQty: 0,
    totalTax: 0,
    totalDiscount: 0,
  });

  useEffect(() => {
    async function calculateCart() {
      const result = await cartCalculationFun(cart.carts);
      setCartResult(result);
    }

    calculateCart();
  }, [cart.carts]);

  // State for form inputs
  const handleOrder = async () => {
    console.log("Dfasdf", cart.carts);
    
    try {
      dispatch(setLoading({ save: true }));
      const validatedFields = onlineOrderValidationSchema.safeParse({
        orderItems: cart.carts,
        orderDate: dayjs().toISOString(),
        netAmount: cartResult.total,
        orderTax: cartResult.totalTax,
        orderTotalAmount: cartResult.total,
        shippingAmount: +shippingCharge?.shippingAmount || 0,
        discountAmount: cartResult.totalDiscount,
        paymentMethod: checkoutFormData.paymentMethod,
        shippingAddressId: checkoutFormData?.shippingAddressId,
      });
      console.log("validatedFields", validatedFields);
      

      if (!validatedFields.success) {
        dispatch(setLoading({ save: false }));
        return {
          errors: validatedFields.error.formErrors,
        };
      }

      console.log("validatedFields.data", validatedFields.data);

      return
      
      const res = await saveOrder(validatedFields.data);

      if (res.message?.formErrors) {
        dispatch(setLoading({ save: false }));
        return;
      }

      if (res.status === 500) {
        dispatch(setResponse({ type: "error", message: res.message }));
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
        setCheckoutFormData({});
        setShippingAddress([]);
        setShippingCharge({});
      }, 1000);
    } catch (err: any) {}
  };

  return (
    <div className="bg-white rounded-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Checkout Summary</h2>
      </div>

      <div className="p-4 rounded">
        <div className="flex justify-between">
          <span>Total Quantity</span>
          <span>{+cartResult.totalQty}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Discount</span>
          <span>{(+cartResult.totalDiscount).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Total Tax</span>
          <span>{(+cartResult.totalTax).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping Cost</span>
          <span>{(+shippingCharge?.shippingAmount || 0).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold text-2xl">
            ৳{(+cartResult.total).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-bold">Total payable</span>
          <span className="font-bold text-2xl">
            ৳
            {(
              +cartResult.total +
              +cartResult.totalTax -
              +cartResult.totalDiscount
            ).toFixed(2)}
          </span>
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        className=" w-full"
        onClick={handleOrder}
        loading={global.loading.save}
        disabled={global.loading.save}
      >
        <span className="me-1">Confirm Order</span>
        {(
          +cartResult.total +
          +cartResult.totalTax -
          +cartResult.totalDiscount +
          (+shippingCharge?.shippingAmount || 0)
        ).toFixed(2)}
        TK.
      </Button>
    </div>
  );
}
