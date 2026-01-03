// "use client";
// import React, { useEffect } from "react";
// import { Alert, Button, Form, Input } from "antd";
// import { useRouter } from "next/navigation";
// import {
//   selectGlobal,
//   setLoading,
//   setResponse,
// } from "@/redux/features/global/globalSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { getSession, signIn } from "next-auth/react";
// import { fetchCartData } from "@/lib/utils/cart";
// import { replaceCart } from "@/redux/features/cart/cartSlice";

"use client";
import React, { useEffect } from "react";
import { Alert, Button, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import {
  selectGlobal,
  setLoading,
  setResponse,
} from "@/redux/features/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import { getSession, signIn } from "next-auth/react";
import { fetchCartData } from "@/lib/utils/cart";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

const Login = () => {
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      if (session?.token) {
        router.replace("/");
      }
    })();
  }, [dispatch, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      const result: any = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        dispatch(
          setResponse({ type: "error", message: "Invalid Login Credentials" })
        );
        dispatch(setLoading({ save: false }));
        return;
      }

      const checkSession = async (): Promise<any> => {
        for (let i = 0; i < 10; i++) {
          const session = await getSession();
          if (session?.user) return session;
          await new Promise((r) => setTimeout(r, 300));
        }
        return null;
      };

      const session = await checkSession();

      if (!session?.user) {
        dispatch(
          setResponse({
            type: "error",
            message: "Login succeeded but session failed",
          })
        );
        dispatch(setLoading({ save: false }));
        return;
      }

      const cart = await fetchCartData();
      dispatch(replaceCart(cart));

      if (session.user.role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      dispatch(setResponse({ type: "error", message: "Something went wrong" }));
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: `${window.location.origin}`,
    });
  };

  const handleFacebookLogin = async () => {
    await signIn("facebook");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100 backdrop-blur-sm bg-opacity-80">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in
            </p>
          </div>

          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            autoComplete="off"
            requiredMark={false}
            className="space-y-6"
          >
            <Form.Item
              name="username"
              label={<span className="text-sm font-medium text-gray-700">Username</span>}
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input
                placeholder="john.doe"
                size="large"
                className="rounded-xl border-gray-300 focus:border-global-primary focus:ring-global-primary"
                onInput={() => dispatch(setResponse({}))}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium text-gray-700">Password</span>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-global-primary hover:text-global-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              }
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                placeholder="••••••••"
                size="large"
                className="rounded-xl border-gray-300 focus:border-global-primary focus:ring-global-primary"
                onInput={() => dispatch(setResponse({}))}
              />
            </Form.Item>

            {global.response.type && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <Alert
                  className="rounded-xl border-none font-medium"
                  message={global.response.message}
                  type={global.response.type}
                  showIcon
                />
              </div>
            )}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-global-primary/20 hover:shadow-xl hover:shadow-global-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
              loading={global.loading.save}
            >
              Sign In
            </Button>
          </Form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center h-12 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
              >
                <FcGoogle size={22} className="mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-700">Google</span>
              </Button>

              <Button
                onClick={handleFacebookLogin}
                className="flex items-center justify-center h-12 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
              >
                <FaFacebook size={22} className="mr-2 text-[#1877F2] group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-700">Facebook</span>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-global-primary hover:text-global-hover transition-colors underline underline-offset-4"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-l from-white/80 to-transparent z-10" />
        <Image
          src="/login_bg.png"
          alt="Login Background"
          fill
          className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-full overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent z-10" />
        <Image
          src="/login_bg.png"
          alt="Login Background"
          fill
          className="object-cover opacity-20 rotate-180 grayscale hover:grayscale-0 transition-all duration-1000"
        />
      </div>
    </div>
  );
};

export default Login;

