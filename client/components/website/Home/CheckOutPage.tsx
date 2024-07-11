/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import { useFormState } from "react-dom";
import WebFooter from "../Footer";
import Image from "next/image";
import {
  selectCart,
  addCart,
  decrementCart,
  removeCart,
} from "@/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { CiSquareRemove } from "react-icons/ci";
import { orderValidationSchema } from "@/validation";
import { saveOrder } from "@/lib/apis/orders";
import { Breadcrumb, Button, Checkbox, Radio } from "antd";

export default function CheckoutPage() {
  const cart = useSelector(selectCart);

  const { subTotal, tax, orderTotalAmount, shippingAmount, discount } =
    cart.carts.reduce(
      (pre: any, curr: any) => {
        let price = +curr.selectProductVarient?.price;
        let sutotal = +price * +curr.qty;
        return {
          subTotal: +pre.subTotal + sutotal - curr.dis,
          discount: +pre.discount + +curr.dis,
          orderTotalAmount: +pre.orderTotalAmount + sutotal - +curr.dis,
        };
      },
      {
        subTotal: 0,
        tax: 0,
        discount: 0,
        orderTotalAmount: 0,
        shippingAmount: 0,
      }
    );

  const dispatch = useDispatch();
  // firstName: formData.get("firstName"),
  // lastName: formData.get("lastName"),
  // paymentMethod: formData.get("paymentMethod"),
  // email: formData.get("email"),
  // address: formData.get("address"),
  // cardNumber: formData.get("cardNumber"),
  // cardName: formData.get("cardName"),
  // expirationDate: formData.get("expirationDate"),
  // cvc: formData.get("cvc"),

  // State for form inputs
  const checkoutAction = async (prevState: any, formData: FormData) => {
    const validatedFields = orderValidationSchema.safeParse({
      orderItems: cart.carts,
      orderDate: "2024-06-27",
      phoneNo: "0178523654",
      deliveryAddress: formData.get("address"),
      paymentStatus: "Paid",
      subTotal,
      tax,
      orderTotalAmount,
      shippingAmount,
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.formErrors,
      };
    }

    await saveOrder(validatedFields.data);

    // const [optimisticState, addOptimistic] = useOptimistic(
    //   state,
    //   // updateFn
    //   (state: any, newMessage) => {}
    // );
    // const result = await register(validatedFields.data);

    // dispatch(setResponse(result));

    // setTimeout(() => {
    //   dispatch(setResponse({}));
    //   if (result?.status === 200) {
    //     router.push("/login");
    //   }
    // }, 5000);
  };

  const [state, fromAction] = useFormState(checkoutAction, null);

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
                      <button
                        className="px-2 py-1 bg-gray-200"
                        onClick={() => dispatch(decrementCart(item))}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="mx-2 w-12 text-center border"
                        value={item?.qty}
                        readOnly
                      />
                      <button
                        className="px-2 py-1 bg-gray-200"
                        onClick={() => dispatch(addCart(item))}
                      >
                        +
                      </button>
                      <span className="ml-4 text-xl font-semibold text-green-600">
                        ৳{" "}
                        {item.discountId &&
                          (
                            +item.selectProductVarient?.price - item.dis
                          ).toFixed(2)}
                      </span>
                      <span className="line-through text-gray-500">
                        ৳ {(+item.selectProductVarient?.price || 0).toFixed(2)}
                      </span>{" "}
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
              <h2 className="text-xl font-semibold">Payment Method</h2>
              {/* <p className="mb-4 text-gray-600">(Please select a payment method)</p> */}
            </div>
            <div className=" mx-auto bg-white p-6 rounded-lg ">
              <Radio.Group name="radiogroup" defaultValue={1} size="large">
                <div className="mb-4 font-semibold border p-5">
                  <Radio value={1}>ক্যাশ অন ডেলিভারি</Radio>
                </div>

                <div className="mb-4 font-semibold border p-5">
                  <Radio value={2}>SSLCOMMERZ</Radio>
                </div>

                <div className="mb-4 font-semibold border p-5">
                  <Radio value={3}>
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
            >
              Confirm Order {(orderTotalAmount + 150 || 0).toFixed(2)} TK.
            </Button>
          </div>
        </div>

        <div className="col-span-1 gap-2   rounded-md overflow-hidden">
          <div className="mx-auto bg-white  rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Shipping Address</h2>
            </div>
            <div className="p-4">
              <p className="text-gray-600">Name: Gowtam Kumar</p>
              <p className="text-gray-600">Phone: 8801767163576</p>
              <p className="text-gray-600">
                Monoharpur, kayemkola bazar, Jhikargacha, Jashore
              </p>
            </div>
          </div>

          <div className="mt-8  mx-auto bg-white  rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Checkout Summary</h2>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳ {(subTotal || 0).toFixed(2)}</span>
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
