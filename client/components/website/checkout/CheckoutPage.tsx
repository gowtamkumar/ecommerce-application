"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setLoading } from "@/redux/features/global/globalSlice";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/apis/user";
import { getShippingCharges } from "@/lib/apis/shipping-charge";
import dynamic from "next/dynamic";

const Breadcrumb = dynamic(() => import("@/components/Breadcrumb"), {
  ssr: false,
});
const CheckoutSummary = dynamic(() => import("./CheckoutSummary"), {
  ssr: false,
});
const OrderSummary = dynamic(() => import("./OrderSummary"), { ssr: false });
const PaymentMethod = dynamic(() => import("./PaymentMethod"), { ssr: false });
const CheckoutShippingAddress = dynamic(
  () => import("./CheckoutShippingAddress"),
  { ssr: false }
);

export default function CheckoutPage() {
  const [checkoutFormData, setCheckoutFormData] = useState({} as any);
  const [shippingAddress, setShippingAddress] = useState([] as any);
  const [shippingCharge, setShippingCharge] = useState({} as any);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    return () => {
      dispatch(setLoading({ save: false }));
      setShippingCharge({});
    };
  }, []);

  async function fetchData() {
    const user = await getMe();
    const activeShippingAddress = user.data?.shippingAddress?.find(
      (item: { status: boolean }) => item.status
    );
    if (activeShippingAddress?.divisionId) {
      const getShippingCharge = await getShippingCharges({
        divisionId: activeShippingAddress.divisionId,
      });
      setShippingCharge(
        getShippingCharge.data?.length ? getShippingCharge.data[0] : {}
      );
    }
    setShippingAddress(user.data?.shippingAddress);
    setCheckoutFormData({
      paymentMethod: "Cash",
      shippingAddressId: activeShippingAddress?.id, //need to logic implements
    });
  }

  return (
    <>
      <Breadcrumb
        homeElement={"Home"}
        separator={<span>___</span>}
        activeClasses="text-amber-500"
        containerClasses="flex bg-bioxin-accent from-purple-600 to-blue-600"
        listClasses="hover:underline mx-2 font-bold"
        capitalizeLinks
      />
      <div className="container lg:p-0 p-2 mx-auto min-h-screen items-center bg-gray-100">
        <div className="py-4 md:py-3 lg:grid lg:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-md content-between">
            <OrderSummary />
            <PaymentMethod
              setCheckoutFormData={setCheckoutFormData}
              checkoutFormData={checkoutFormData}
            />
          </div>

          <div className="col-span-1 gap-2 rounded-md">
            <CheckoutShippingAddress
              setCheckoutFormData={setCheckoutFormData}
              setShippingCharge={setShippingCharge}
              checkoutFormData={checkoutFormData}
              shippingAddress={shippingAddress}
            />
            <CheckoutSummary
              checkoutFormData={checkoutFormData}
              shippingCharge={shippingCharge}
              setCheckoutFormData={setCheckoutFormData}
              setShippingAddress={setShippingAddress}
            />
          </div>
          <div className="text-blue-500 hover:underline lg:text-start text-center">
            <Link href="/products">Back to Shopping</Link>
          </div>
        </div>
      </div>
    </>
  );
}
