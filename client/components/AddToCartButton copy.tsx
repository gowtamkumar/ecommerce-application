// "use client";
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Button, message } from "antd";
// import { FaCheckCircle } from "react-icons/fa";
// import { useSession } from "next-auth/react";
// import {
//   selectGlobal,
//   setBooking,
//   setLoading,
// } from "@/redux/features/global/globalSlice";
// import { addCart } from "@/redux/features/cart/cartSlice";
// import { setProduct } from "@/redux/features/products/productSlice";
// import { discountTaxCalculationFun } from "@/lib/share/discountTaxCalculationFun";
// import { createToCart } from "@/lib/apis/cart";
// import BookingForm from "./treatment-booking/BookingForm";
// import ModalLogin from "./login/ModalLogin";
// import BookingInvoice from "./treatment-booking/BookingInvoice";
// import Link from "next/link";

// export default function AddToCartButton({ product }: any) {
//   const [unAuthorize, setUnAuthorize] = useState(false);
//   const global = useSelector(selectGlobal);
//   const dispatch = useDispatch();
//   const session = useSession();

//   const isOutOfStock = product.current_stock === "0";
//   const buttonStyle = { fontFamily: "unset" };

//   const handleBooking = (value: any) => {
//     if (session.status === "unauthenticated") {
//       setUnAuthorize(true);
//     } else {
//       dispatch(setBooking(true));
//       // dispatch(setBookingPdf(false));
//       dispatch(setProduct(value));
//     }
//   };

//   const handleAddToCart = async (value: any) => {
//     dispatch(setLoading({ ...global.loading, productId: value.id }));
//     const res = discountTaxCalculationFun(value);

//     try {
//       if (session.status === "authenticated") {
//         const cartData = {
//           id: value.id,
//           quantity: 1,
//           variant: value.variant_product,
//           color: value.colors.length ? value.colors[0] : "",
//           attributes: [],
//           attribute_values: [],
//         };

//         const cart = await createToCart(cartData);
//         if (!cart.success) {
//           message.warning(cart.message);
//         } else {
//           dispatch(addCart(cart.data));
//         }
//       } else {
//         dispatch(addCart({ ...value, ...res, quantity: 1 }));
//       }
//     } catch (err) {
//       message.error("Failed to add to cart. Please try again.");
//     } finally {
//       setTimeout(() => {
//         dispatch(setLoading({}));
//       }, 1000);
//     }
//   };

//   const isLoading = global.loading.productId === product.id;

//   return (
//     <>
//       {isLoading && (
//         <div className="flex gap-1 justify-center py-2">
//           <FaCheckCircle className="text-green-500" size={22} />
//           Added to cart
//         </div>
//       )}

//       {product.variant_product === "1" || product.is_variant ? (
//         <Button className="antd-btn" href={`/product/${product.slug}`}>
//           See Details
//         </Button>
//       ) : (
//         <Button
//           className={
//             product.digital === "1"
//               ? "antd-btn"
//               : isOutOfStock
//               ? "antd-btn-disable"
//               : "antd-btn"
//           }
//           onClick={
//             product.digital === "1"
//               ? () => handleBooking(product)
//               : () => handleAddToCart(product)
//           }
//           style={buttonStyle}
//           disabled={isLoading || (product.digital !== "1" && isOutOfStock)}
//           loading={isLoading}
//         >
//           {product.digital === "1"
//             ? "Booking Now"
//             : isOutOfStock
//             ? "Out Of Stock"
//             : "Add To Cart"}
//         </Button>
//       )}

//       {global.booking && <BookingForm />}
//       {global.treatmentBooking && <BookingInvoice />}
//       {unAuthorize && (
//         <ModalLogin unAuthorize={unAuthorize} setUnAuthorize={setUnAuthorize} />
//       )}
//     </>
//   );
// }
