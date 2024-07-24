"use client";
import Link from "next/link";
import WebFooter from "../Footer";
import {
  selectCart,
  addCart,
  decrementCart,
  removeCart,
  clearCart,
} from "@/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { CiEdit, CiSquareRemove } from "react-icons/ci";
import { orderValidationSchema } from "@/validation";
import { saveOrder } from "@/lib/apis/orders";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Popconfirm,
  Radio,
  Space,
} from "antd";
import {
  selectGlobal,
  setAction,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";
import { ActionType } from "@/constants/constants";
import AddShippingAddress from "@/components/dashboard/shipping-address/AddShippingAddress";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/apis/user";
import Image from "next/image";
import { MdDelete } from "react-icons/md";

export default function CheckoutPage() {
  const [checkoutFormData, setCheckoutFormData] = useState({} as any);
  const [shippingAddress, setShippingAddress] = useState([] as any);
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  // const currentUrl = window.location.pathname
  // const router = useRouter();
  // console.log("🚀 ~ currentUrl:", currentUrl)

  useEffect(() => {
    async function fetchData() {
      const user = await getMe();
      const activeShippingAddress = user.data?.shippingAddress?.find(
        (item: { status: boolean }) => item.status
      );
      setShippingAddress(user.data?.shippingAddress);
      setCheckoutFormData({
        paymentMethod: "Cash",
        shippingAddressId: activeShippingAddress?.id, //need to logic implements
      });
    }
    fetchData();
  }, [global.action, dispatch]);

  const { netAmount, taxAmount, orderTotalAmount, discountAmount } =
    cart.carts.reduce(
      (pre: any, curr: any) => {
        let sutotal = (+curr.price + curr?.tax) * +curr.qty;
        return {
          taxAmount: (+pre.taxAmount + curr?.tax) * +curr.qty,
          netAmount:
            +pre.netAmount +
            sutotal -
            (+curr.discountA || 0) * (+curr.qty || 0),
          discountAmount:
            +pre.discountAmount + (+curr.discountA || 0) * (+curr.qty || 0),
          orderTotalAmount:
            +pre.orderTotalAmount +
            +sutotal -
            (+curr.discountA * +curr.qty || 0),
        };
      },
      {
        taxAmount: 0,
        netAmount: 0,
        discountAmount: 0,
        orderTotalAmount: 0,
      }
    );

  // State for form inputs
  const handleOrder = async () => {
    try {
      dispatch(setLoading({ save: true }));
      const validatedFields = orderValidationSchema.safeParse({
        orderItems: cart.carts,
        orderDate: "2024-02",
        paymentStatus: "Paid",
        netAmount,
        orderTax: taxAmount,
        orderTotalAmount,
        shippingAmount: 150,
        discountAmount,
        paymentMethod: checkoutFormData.paymentMethod,
        shippingAddressId: checkoutFormData?.shippingAddressId,
      });

      if (!validatedFields.success) {
        dispatch(setLoading({ save: false }));
        return {
          errors: validatedFields.error.formErrors,
        };
      }

      // return console.log("newData:", validatedFields);
      const res = await saveOrder(validatedFields.data);

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
      }, 2000);
    } catch (err: any) {
      console.log("🚀 ~ err:", err);
    }
  };

  const findAddress = shippingAddress?.find(
    (item: { id: number }) => item.id === checkoutFormData.shippingAddressId
  );

  function removeFromCart(value: { id: number }) {
    try {
      dispatch(setLoading({ remove: true }));
      dispatch(removeCart(value));

      setTimeout(async () => {
        dispatch(setLoading({ remove: false }));
      }, 1000);
    } catch (err) {
      console.log("err");
    }
  }

  return (
    <>
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
                  <div key={idx} className="p-3 flex border-b">
                    <Image
                      width={100}
                      height={100}
                      src="/pos_software.png"
                      alt="Product"
                      className="w-24 h-24 object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="text-base font-semibold">{item?.name}</h3>
                      <span>Size: {item.selectProductVarient?.size?.name}</span>
                      <span>
                        Color: {item.selectProductVarient?.color?.name}
                      </span>
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

                        <div className="ml-4 text-base font-semibold text-green-600">
                          ৳{" "}
                          {item.discountId
                            ? (
                                +item.price +
                                +item.tax -
                                item?.discountA
                              ).toFixed(2)
                            : (+item.price + item.tax || 0).toFixed(2)}
                        </div>
                        {item?.discountId ? (
                          <div className="text-base">
                            <span className="line-through text-gray-500">
                              ৳ {(+item.price + +item.tax || 0).toFixed(2)}
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

                    <div>
                      <Popconfirm
                        title="Delete Order item"
                        description="Are you sure to delete this Order item?"
                        onConfirm={() => removeFromCart(item)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ loading: global.loading.remove }}
                        placement="left"
                      >
                        <MdDelete size={20} className="cursor-pointer" />
                      </Popconfirm>
                    </div>

                    {/* 
                  <CiSquareRemove
                    size={30}
                    className="cursor-pointer"
                    onClick={() => dispatch(removeCart(item))}
                  /> */}
                  </div>
                );
              })}
            </div>

            <div className="mx-auto bg-white overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">
                  Payment Method(Please select a payment method)
                </h2>
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
                        <Image
                          width={50}
                          height={50}
                          src="/pos_software.png"
                          alt="Visa"
                          className="h-8"
                        />
                        <Image
                          width={50}
                          height={50}
                          src="/pos_software.png"
                          alt="MasterCard"
                          className="h-8"
                        />
                        <Image
                          width={50}
                          height={50}
                          src="/pos_software.png"
                          alt="American Express"
                          className="h-8"
                        />
                        <Image
                          width={50}
                          height={50}
                          src="/pos_software.png"
                          alt="Other Cards"
                          className="h-8"
                        />
                      </div>
                    </Radio>
                  </div>
                </Radio.Group>

                {/* <!-- Terms and Conditions --> */}
                <div className="mb-4">
                  <label className="flex items-center justify-between gap-x-2">
                    <span>
                      <Checkbox type="checkbox" />
                      <span className="ml-1">
                        রফকারির শর্তাবলীতো সম্মতি প্রদান করছি।{" "}
                        <a href="#" className="text-blue-500 underline">
                          শর্তাবলী
                        </a>
                      </span>
                    </span>
                    {global.response.type && (
                      <Alert
                        className="p-0 m-0"
                        message={`${global.response.message}`}
                        type={global.response.type}
                      />
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="p-4 border-t text-right">
              <Button
                type="primary"
                size="large"
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={() => handleOrder()}
                loading={global.loading.save}
                disabled={global.loading.save}
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
                  }}
                  value={checkoutFormData?.shippingAddressId}
                >
                  {shippingAddress?.map(
                    (
                      item: { id: number; type: string; status: boolean },
                      idx: number
                    ) => (
                      <Space direction="vertical" key={idx}>
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

                <Link href="/profile">
                  <Button
                    className="mt-2"
                    size="small"
                    type="default"
                    style={{ width: "100%" }}
                  >
                    All Address
                  </Button>
                </Link>

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
            <div className="text-blue-500 hover:underline">
              Back to Shopping
            </div>
          </Link>
        </div>
      </div>
      <WebFooter />
    </>
  );
}
