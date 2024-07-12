/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import WebFooter from "../Footer";
import Image from "next/image";
import {
  selectCart,
  addCart,
  decrementCart,
  removeCart,
} from "@/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { CiEdit, CiSquareRemove } from "react-icons/ci";
import { orderValidationSchema } from "@/validation";
import { saveOrder } from "@/lib/apis/orders";
import { Breadcrumb, Button, Checkbox, Input, Radio, Space } from "antd";
import { setAction, setFormValues } from "@/redux/features/global/globalSlice";
import { ActionType } from "@/constants/constants";
import AddShippingAddress from "@/components/dashboard/shipping-address/AddShippingAddress";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CheckoutPage({ shippingAddress }: any) {
  const [checkoutFormData, setCheckoutFormData] = useState({} as any);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
    // const currentUrl = window.location.pathname
    // // const router = useRouter()
    // console.log("🚀 ~ currentUrl:", currentUrl)

  // useEffect(() => {
  //   (async () => {
  //     dispatch(
  //       setFormValues({
  //         paymentMethod: "Cash",
  //         shippingAddressId: shippingAddress[0].id, //need to logic implements
  //       })
  //     );
  //   })();
  // }, [dispatch, shippingAddress]);

  const { netAmount, orderTotalAmount, discountAmount } = cart.carts.reduce(
    (pre: any, curr: any) => {
      let sutotal = +curr.price * +curr.qty;
      return {
        netAmount: +pre.netAmount + sutotal - (+curr.dis || 0),
        discountAmount: +pre.discountAmount + (+curr.dis || 0),
        orderTotalAmount: +pre.orderTotalAmount + +sutotal - (+curr.dis || 0),
      };
    },
    {
      netAmount: 0,
      discountAmount: 0,
      orderTotalAmount: 0,
    }
  );

  // State for form inputs
  const checkoutAction = async () => {
    const validatedFields = orderValidationSchema.safeParse({
      orderItems: cart.carts,
      orderDate: "2024-06-27",
      paymentStatus: "Paid",
      netAmount,
      tax: 24,
      orderTotalAmount,
      shippingAmount: 150,
      discountAmount,
      paymentMethod: checkoutFormData.paymentMethod,
      shippingAddressId: checkoutFormData.shippingAddressId,
    });

    console.log(validatedFields);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.formErrors,
      };
    }

    return;

    await saveOrder(validatedFields.data);
  };

  const findAddress = shippingAddress.find(
    (item: { id: number }) => item.id === checkoutFormData.shippingAddressId
  );

  return (
    <div className="min-h-screen bg-gray-100 lg:w-8/12 mx-auto items-center">
      <div className="pt-2">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: "Home",
            },
            {
              title: "Application Center",
              href: "",
            },
            {
              title: "Application List",
              href: "",
            },
            {
              title: "An Application",
            },
          ]}
        />
      </div>

      <div className="py-4 md:py-3 grid grid-cols-3 gap-4 ">
        <div className="col-span-2 bg-white  rounded-md overflow-hidden content-between">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold">Order summary</h2>
          </div>
          <div>
            {cart.carts.map((item: any, idx: number) => {
              return (
                <div key={idx} className="p-4 flex">
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Product"
                    className="w-24 h-24 object-cover"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="text-base font-semibold">{item?.name}</h3>
                    <span>Size: {item.selectProductVarient?.size?.name}</span>
                    <span>Color: {item.selectProductVarient?.color?.name}</span>
                    <div className="mt-2 flex items-center">
                      <Button
                        className="px-2 py-1 bg-gray-200"
                        onClick={() => dispatch(decrementCart(item))}
                      >
                        -
                      </Button>
                      <input
                        type="text"
                        className="mx-2 w-10 text-center border"
                        value={item?.qty}
                        readOnly
                      />
                      <Button
                        className="px-2 py-1 bg-gray-200"
                        onClick={() => dispatch(addCart(item))}
                      >
                        +
                      </Button>

                      <span className="ml-4 text-base font-semibold text-green-600">
                        ৳{" "}
                        {item.discountId
                          ? (+item?.price - item?.dis).toFixed(2)
                          : (+item?.price || 0).toFixed(2)}
                      </span>
                      {item?.discountId ? (
                        <div className="text-base">
                          <span className="line-through text-gray-500">
                            ৳ {(+item?.price || 0).toFixed(2)}
                          </span>
                          <span className="text-green-600 ml-2">
                            - {item?.discount?.value}
                            {item?.discount?.discountType === "Percentage"
                              ? "%"
                              : "BDT"}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <CiSquareRemove
                    size={30}
                    className="cursor-pointer"
                    onClick={() => dispatch(removeCart(item))}
                  />
                </div>
              );
            })}
          </div>

          <div className="mx-auto bg-white overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              {/* <p className="mb-4 text-gray-600">(Please select a payment method)</p> */}
            </div>
            <div className=" mx-auto bg-white p-6 rounded-lg ">
              <Radio.Group
                name="paymentMethod"
                onChange={({ target }) =>
                  setCheckoutFormData({
                    ...checkoutFormData,
                    paymentMethod: target.value,
                  })
                }
                value={checkoutFormData.paymentMethod}
                size="large"
              >
                <div className="mb-4 font-semibold border p-5">
                  <Radio value="Cash">ক্যাশ অন ডেলিভারি</Radio>
                </div>

                <div className="mb-4 font-semibold border p-5">
                  <Radio value="SSLCOMMERZ">SSLCOMMERZ</Radio>
                </div>

                <div className="mb-4 font-semibold border p-5">
                  <Radio value="Stripe">
                    ডেবিট / ক্রেডিট কার্ড
                    <div className="flex gap-2 items-center">
                      <img src="visa-logo.png" alt="Visa" className="h-8" />
                      <img
                        src="mastercard-logo.png"
                        alt="MasterCard"
                        className="h-8"
                      />
                      <img
                        src="amex-logo.png"
                        alt="American Express"
                        className="h-8"
                      />
                      <img
                        src="other-card-logo.png"
                        alt="Other Cards"
                        className="h-8"
                      />
                    </div>
                  </Radio>
                </div>
              </Radio.Group>

              {/* <!-- Terms and Conditions --> */}
              <div className="mb-4">
                <label className="flex items-center gap-x-2">
                  <Checkbox type="checkbox" className="mr-2" />
                  <span>
                    রফকারির শর্তাবলীতো সম্মতি প্রদান করছি।{" "}
                    <a href="#" className="text-blue-500 underline">
                      শর্তাবলী
                    </a>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-4 border-t text-right">
            <Button
              type="primary"
              size="large"
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => checkoutAction()}
            >
              Confirm Order {(orderTotalAmount + 150 || 0).toFixed(2)} TK.
            </Button>
          </div>
        </div>

        <div className="col-span-1 gap-2 rounded-md overflow-hidden">
          <div className="mx-auto bg-white  rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>
            <div className="p-2">
              <Radio.Group
                name="shippingAddressId"
                onChange={({ target }) => {
                  setCheckoutFormData({
                    ...checkoutFormData,
                    shippingAddressId: target.value,
                  });
                  // dispatch(
                  //   setFormValues({
                  //     ...checkoutFormData,
                  //     shippingAddressId: target.value,
                  //   })
                  // );
                }}
                value={checkoutFormData?.shippingAddressId}
              >
                {shippingAddress.map(
                  (item: { id: number; type: string; status: boolean }) => (
                    <Space direction="vertical" key={item.id}>
                      <Radio value={item.id}>{item.type}</Radio>
                    </Space>
                  )
                )}
              </Radio.Group>

              {findAddress?.name && (
                <div className="text-sm flex justify-between">
                  <div className="overflow-hidden">
                    <p className="text-gray-600">Name: {findAddress?.name}</p>
                    <p className="text-gray-600">
                      Phone: {findAddress?.phoneNo}
                    </p>
                    <p className="text-gray-600">
                      Address: {findAddress?.address}
                    </p>
                  </div>
                  <div>
                    <CiEdit
                      className="cursor-pointer"
                      onClick={() =>
                        dispatch(
                          setAction({
                            type: ActionType.UPDATE,
                            payload: findAddress,
                          })
                        )
                      }
                    />
                  </div>
                </div>
              )}

              <Button
                className="mt-2"
                size="small"
                type="default"
                style={{ width: "100%" }}
                onClick={() =>
                  dispatch(
                    setAction({
                      type: ActionType.CREATE,
                    })
                  )
                }
              >
                New Address
              </Button>
              <AddShippingAddress />
            </div>
          </div>

          <div className="mt-8  mx-auto bg-white  rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Checkout Summary</h2>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳ {(netAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Shipping</span>
                <span> ৳ {(150 || 0).toFixed(2)}.</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>৳ {(orderTotalAmount + 150 || 0).toFixed(2)}.</span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Payable Total</span>
                <span>৳ {(orderTotalAmount + 150 || 0).toFixed(2)}.</span>
              </div>
            </div>
          </div>

          <div className="mt-8  mx-auto bg-white  rounded-md overflow-hidden">
            <div className="p-4">
              <div className="flex gap-3 font-semibold text-gray-600">
                <span>Icon</span>
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex gap-3 font-semibold text-gray-600">
                <span>Icon</span>
                <span>৭ দিনের মধ্যে পণ্য ফেরত সুবিধা</span>
              </div>
              <div className="flex gap-3 font-semibold text-gray-600">
                <span>Icon</span>
                <span>১০০% টাকা ফেরত গ্যারান্টি</span>
              </div>

              <div className="flex gap-3 font-semibold text-gray-600">
                <span>Icon</span>
                <span>অর্ডার করে পয়েন্টস জিতুন</span>
              </div>

              <div className="flex gap-3 font-semibold text-gray-600">
                <span>Icon</span>
                <span>১০০% অরিজিনাল প্রোডাক্ট</span>
              </div>
            </div>
          </div>
        </div>

        <Link href="/products">
          <div className="text-blue-500 hover:underline">Back to Shopping</div>
        </Link>
      </div>
      <WebFooter />
    </div>
  );
}
