// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, message, Divider, Checkbox, Alert } from "antd";
// import Link from "next/link";
// import BreadCrumb from "../Breadcrumb";
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectGlobal,
//   setPreviousUrl,
// } from "@/redux/features/global/globalSlice";
// import { replaceCart, selectCart } from "@/redux/features/cart/cartSlice";
// import { createToCart, getCarts } from "@/lib/apis/cart";
// import { loginWithSocial } from "@/lib/apis/auth";

// const LoginForm: React.FC = () => {
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   // hook
//   const [form] = Form.useForm();
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const global = useSelector(selectGlobal);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (status === "authenticated" && !global.previousUrl) {
//       // Redirect to home page if already logged in
//       router.push("/");
//     }
//   }, [status, router]);

//   const handleFinish = async (values: Record<string, any>) => {
//     setLoading(true);
//     const result = await signIn("credentials", {
//       ...values,
//       redirect: false,
//     });

//     if (result?.error) {
//       setError("Invalid login Credential");
//       setLoading(false);
//       return;
//     }

//     const cartData = await getCarts();

//     const cartItems = cartData.data?.cartList[0]?.cart_items || [];

//     const localData =
//       typeof window !== "undefined"
//         ? JSON.parse(localStorage.getItem("carts") || "[]")
//         : [];

//     if (result?.ok) {
//       const resUP = localData?.filter(
//         (obj1: { product_id: string; id: string }) =>
//           !cartItems?.some(
//             (obj2: { product_id: string }) =>
//               (obj1.product_id ? obj1.product_id : obj1.id) === obj2.product_id
//           )
//       );

//       // if large localStorage Data
//       if (resUP.length) {
//         for (let index = 0; index < resUP.length; index++) {
//           const element = resUP[index];
//           const cartData = {
//             id: element.id,
//             quantity: 1,
//             variant: element.variant_product,
//             color: element.color,
//             attributes: [],
//             attribute_values: [],
//           };
//           const cart = await createToCart(cartData);
//         }

//         const cartData = await getCarts();
//         const cartItems = cartData.data?.cartList[0]?.cart_items || [];
//         dispatch(replaceCart(cartItems));
//       } else {
//         dispatch(replaceCart(cartItems));
//       }
//     }

//     setTimeout(() => {
//       if (result?.ok && global.previousUrl) {
//         dispatch(setPreviousUrl(""));
//         router.push(`${global.previousUrl}`);
//       }

//       if (result?.ok && !global.previousUrl) {
//         router.push("/");
//       }
//       message.success("Welcome back! You have logged in successfully.");
//       form.resetFields(); // Clear form fields after login
//       setLoading(false);
//       setError("");
//     }, 500);
//   };

//   const facebookHandel = async () => {
//     const result = await signIn("facebook", {
//       callbackUrl: `${window.location.origin}`,
//     });
//   };

//   const googleHandel = async () => {
//     const result = await signIn("google", {
//       callbackUrl: `${window.location.origin}`,
//     });
//   };

//   return (
//     <>
//       <BreadCrumb
//         homeElement={"Home"}
//         separator={<span>___</span>}
//         activeClasses="text-amber-500"
//         containerClasses="flex bg-bioxin-accent from-purple-600 to-blue-600"
//         listClasses="hover:underline mx-2 font-bold"
//         capitalizeLinks
//       />
//       <div className="container mx-auto max-w-md section-spacing-bioxin ">
//         <div className="mb-20 shadow px-6 py-8 rounded">
//           <h2 className="text-center section-heading mb-10 text-bioxin-primary">
//             Login !!!
//           </h2>
//           <Form
//             name="basic"
//             form={form}
//             layout="vertical"
//             autoComplete="off"
//             onFinish={handleFinish}
//           >
//             <Form.Item
//               name="phone"
//               label="Phone Number"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter your phone number!",
//                 },
//                 {
//                   len: 11,
//                   message: "Phone number must be 11 digits (excluding +88).",
//                 },
//                 // Followed by valid prefixes: 13, 14, 15, 16, 17, 18, or 19
//                 {
//                   pattern: /^(?:\+88|88)?01[3-9]\d{8}$/,
//                   message: "Please enter a valid phone number.",
//                 },
//               ]}
//             >
//               <Input
//                 addonBefore="+88"
//                 size="large"
//                 placeholder="Enter phone number"
//               />
//             </Form.Item>
//             <Form.Item
//               name="password"
//               label="Password"
//               rules={[
//                 {
//                   required: true,
//                   message: "Please enter your password!",
//                 },
//               ]}
//             >
//               <Input.Password size="large" placeholder="Enter password" />
//             </Form.Item>

//             <div className="flex items-center justify-between text-right mb-4">
//               {/* <Form.Item name="remember" valuePropName="checked" noStyle>
//                 <Checkbox>Remember Me</Checkbox>
//               </Form.Item> */}
//               <div></div>
//               <Link
//                 href="/forgot-password"
//                 className="text-blue-500 hover:underline"
//               >
//                 Forgot Password?
//               </Link>
//             </div>

//             <Button
//               className="antd-btn"
//               htmlType="submit"
//               loading={loading}
//               disabled={loading}
//               block
//             >
//               Login
//             </Button>
//           </Form>
//           <div className="mt-4">
//             {error && (
//               <Alert className="text-center" message={error} type="error" />
//             )}
//           </div>
//           <Divider>Or Login With </Divider>
//           <div className="flex justify-center gap-3">
//             <FaFacebook
//               size={25}
//               className="cursor-pointer"
//               onClick={facebookHandel}
//             />
//             <FaGoogle
//               size={25}
//               className="cursor-pointer"
//               onClick={googleHandel}
//             />
//           </div>
//           <div className="text-center mt-5">
//             <p> Dont have an account?</p>
//             <Link href={"/signup"}>Register Now</Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginForm;
