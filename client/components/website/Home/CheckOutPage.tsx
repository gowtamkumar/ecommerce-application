/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Link from "next/link";
import Header from "../Header";
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
import { CiCirclePlus, CiCircleMinus, CiSquareRemove } from "react-icons/ci";
import { orderValidationSchema } from "@/validation";
import { saveOrder } from "@/lib/apis/orders";

export default function CheckoutPage() {
  const cart = useSelector(selectCart);

  const { netAmount, tax, orderTotalAmount, shippingAmount } =
    cart.carts.reduce(
      (pre: any, curr: any) => {
        let sutotal = pre.netAmount + +curr.price * +curr.qty;
        let taxAmount =
          curr.taxType === "FixedAmount"
            ? curr.tax || 0
            : (+sutotal * (+curr.tax || 0)) / 100;

        return {
          netAmount: sutotal,
          tax: +pre.tax + +taxAmount,
          shippingAmount: +pre.shippingAmount + +curr.shippingCost,
          orderTotalAmount: sutotal + +pre.tax + +taxAmount,
        };
      },
      { netAmount: 0, tax: 0, orderTotalAmount: 0, shippingAmount: 0 }
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
      netAmount,
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
    <div className="container mx-auto">
      <Header />
      {/* <div className="bg-gray-100 min-h-screen">
        <div className="p-4 md:p-8 grid grid-cols-3 gap-4">
          <div className=" col-span-2 bg-white shadow-md rounded-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-semibold">
                gowtam, your total:{" "}
                <span className="text-green-600 line-through">1,700 Tk.</span>{" "}
                <span className="text-green-600">1,190 Tk.</span>
              </h2>
            </div>

            <div className="p-4 flex">
              <img
                src="https://via.placeholder.com/100"
                alt="Product"
                className="w-24 h-24 object-cover"
              />
              <div className="ml-4 flex-grow">
                <h3 className="text-xl font-semibold">
                  Adata UV128 USB 3.2 Black Blue 128 GB
                </h3>
                <p className="text-gray-600">Adata</p>
                <div className="mt-2 flex items-center">
                  <button className="px-2 py-1 bg-gray-200">-</button>
                  <input
                    type="text"
                    className="mx-2 w-12 text-center border"
                    value="1"
                    readOnly
                  />
                  <button className="px-2 py-1 bg-gray-200">+</button>
                  <p className="ml-4 text-xl font-semibold text-green-600">
                    1,190 Tk.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md">
                Order as a Gift
              </button>
              <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md">
                Proceed to Check Out
              </button>
            </div>
          </div>

          <div className="col-span-1 bg-white shadow-md rounded-md overflow-hidden">
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

            <div className="mt-8  mx-auto bg-white shadow-md rounded-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Checkout Summary</h2>
              </div>
              <div className="p-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>1,190 Tk.</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-2">
                  <span>Shipping</span>
                  <span>69 Tk.</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span>1,259 Tk.</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Payable Total</span>
                  <span>1,259 Tk.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container  flex mx-auto px-4 py-8">
        <div className="w-4/6 px-6 space-y-4">
          {/* Shipping Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
            <form action={fromAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {/* Add more fields as needed */}
              {/* <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  required
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Card number
                </label>
                <input
                  type="number"
                  id="cardNumber"
                  name="cardNumber"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label
                  htmlFor="cardName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Card Name
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="flex justify-between">
                <div className="w-2/3 mr-2">
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    id="expirationDate"
                    name="expirationDate"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="w-1/3">
                  <label
                    htmlFor="cvc"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    CVC
                  </label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div> */}

              {/* Add more payment options as needed */}
              <div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
          {/* Back to Shopping Link */}
          <div>
            <Link href="/products">
              <div className="text-blue-500 hover:underline">
                Back to Shopping
              </div>
            </Link>
          </div>
        </div>
        <div className="w-2/6">
          <div className="mb-8 ">
            <h2 className="text-xl font-semibold mb-2">Order summary</h2>

            <div className="border p-3">
              {/* Display cart items and total */}
              {cart.carts.map((item: any, idx: number) => {
                return (
                  <div key={idx}>
                    <div className="flex w-full border-b-2 items-center ">
                      <div className="bg-slate-300">
                        <Image
                          width={50}
                          height={50}
                          // className="h-9 w-auto px-2"
                          src="/pos_software.png"
                          alt="Your Company"
                        />
                      </div>
                      <div className="flex items-center justify-between w-full p-2">
                        <div>
                          <span>{item?.name}</span>
                          <p>size</p>
                          <strong className="text-gray-900">
                            ${item?.price}
                          </strong>
                        </div>
                        <div className="gap-y-5 grid ">
                          <div className=" flex justify-end">
                            <CiSquareRemove
                              size={30}
                              className="cursor-pointer"
                              onClick={() => dispatch(removeCart(item))}
                            />
                          </div>
                          <div className="flex gap-2">
                            <div
                              className="cursor-pointer p-1"
                              onClick={() => dispatch(decrementCart(item))}
                            >
                              <CiCircleMinus size={20} className="text-black" />
                            </div>
                            <div>{item?.qty}</div>
                            <div
                              className="cursor-pointer p-1"
                              onClick={() => dispatch(addCart(item))}
                            >
                              <CiCirclePlus size={20} className="text-black" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Add more cart items as needed */}
              <div className="grid gap-y-5 my-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-semibold">
                    $ {(netAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Shipping:</span>
                  <span className="font-semibold">
                    $ {(shippingAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Tax:</span>
                  <span className="font-semibold">
                    $ {(tax || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between border-t-2">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">
                    $ {(orderTotalAmount + shippingAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WebFooter />
    </div>
  );
}
