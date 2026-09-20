"use client";
import { fetchCartData } from "@/lib/utils/cart";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import {
    selectGlobal,
    setLoading,
    setResponse,
} from "@/redux/features/global/globalSlice";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiLock,
    FiShield,
    FiUser,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [rememberMe, setRememberMe] = useState(true);
  const [loadingOAuth, setLoadingOAuth] = useState<"google" | "facebook" | null>(null);

  // Retrieve callback destination (e.g. returning to checkout or profile)
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const siteData = global.setting || {};

  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      if (session?.token) {
        if (callbackUrl && callbackUrl !== "/login") {
          router.replace(callbackUrl);
        } else if (session?.user?.role === "Admin") {
          router.replace("/dashboard");
        } else {
          router.replace("/");
        }
      }
    })();
  }, [callbackUrl, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      const result: any = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        dispatch(
          setResponse({
            type: "error",
            message: "Invalid username or password. Please verify your details.",
          })
        );
        dispatch(setLoading({ save: false }));
        return;
      }

      // Quick check for active session resolution
      let session: any = null;
      for (let i = 0; i < 6; i++) {
        session = await getSession();
        if (session?.user) break;
        await new Promise((r) => setTimeout(r, 200));
      }

      if (!session?.user) {
        dispatch(
          setResponse({
            type: "error",
            message: "Login succeeded, but session initialisation failed. Please try again.",
          })
        );
        dispatch(setLoading({ save: false }));
        return;
      }

      // Sync customer cart asynchronously
      try {
        const cart = await fetchCartData();
        if (cart) dispatch(replaceCart(cart));
      } catch (cartErr) {
        console.warn("Cart synchronization notice:", cartErr);
      }

      // Route customer seamlessly to their target or dashboard
      if (callbackUrl && callbackUrl !== "/" && callbackUrl !== "/login") {
        router.push(callbackUrl);
      } else if (session.user.role === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      dispatch(
        setResponse({
          type: "error",
          message: "An unexpected error occurred. Please try again later.",
        })
      );
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoadingOAuth("google");
      await signIn("google", {
        callbackUrl: callbackUrl && callbackUrl !== "/login" ? callbackUrl : `${window.location.origin}`,
      });
    } catch (err) {
      console.error("Google OAuth error:", err);
      dispatch(
        setResponse({
          type: "error",
          message: "Failed to authenticate with Google. Please try again.",
        })
      );
      setLoadingOAuth(null);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoadingOAuth("facebook");
      await signIn("facebook", {
        callbackUrl: callbackUrl && callbackUrl !== "/login" ? callbackUrl : `${window.location.origin}`,
      });
    } catch (err) {
      console.error("Facebook OAuth error:", err);
      dispatch(
        setResponse({
          type: "error",
          message: "Failed to authenticate with Facebook. Please try again.",
        })
      );
      setLoadingOAuth(null);
    }
  };

  const registerLink = callbackUrl
    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/register";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Elevated Card with Split-Screen Layout */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[640px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: E-Commerce Lifestyle & Brand Value Showcase (Visible on Desktop) */}
        {/* ========================================================================= */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-12 overflow-hidden bg-gray-950 text-white select-none">
          {/* Background Image with Atmospheric Lighting */}
          <Image
            src="/login_bg.png"
            alt="Exclusive Shopping Experience"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
          />
          
          {/* Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-gray-950/30" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-global-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-white shadow-sm">
              <HiSparkles className="text-global-primary text-sm animate-pulse" />
              <span>VIP Member Privileges</span>
            </div>

            <h2 className="mt-6 text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Elevate Your Everyday Shopping Experience.
            </h2>
            <p className="mt-3 text-sm xl:text-base text-gray-300 font-normal leading-relaxed max-w-md">
              Sign in to manage your orders, track parcels in real time, and unlock personalized member savings.
            </p>
          </div>

          {/* Middle: Value Proposition Pillars */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-global-primary/20 border border-global-primary/30 flex items-center justify-center shrink-0 text-global-primary">
                <HiOutlineTruck className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Real-Time Order Tracking</h4>
                <p className="text-xs text-gray-300 mt-0.5">Live shipping status and delivery updates right from your dashboard.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-global-primary/20 border border-global-primary/30 flex items-center justify-center shrink-0 text-global-primary">
                <FiShield className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Buyer Protection & Easy Returns</h4>
                <p className="text-xs text-gray-300 mt-0.5">Shop with complete peace of mind with 30-day hassle-free returns.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-global-primary/20 border border-global-primary/30 flex items-center justify-center shrink-0 text-global-primary">
                <HiSparkles className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Exclusive Member Promotions</h4>
                <p className="text-xs text-gray-300 mt-0.5">Earn reward points on every purchase and receive early access to sales.</p>
              </div>
            </div>
          </div>

          {/* Bottom: Social Proof / Community Trust */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-sm">
                {"★★★★★"}
              </div>
              <span className="text-xs font-semibold text-white">4.9 / 5.0</span>
            </div>
            <span className="text-xs text-gray-300">
              Trusted by <strong className="text-white">50,000+</strong> shoppers
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Modern High-Conversion Authentication Form */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-10 xl:p-12">
          <div>
            {/* Navigation / Return Link */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-global-primary transition-colors group"
              >
                <FiArrowLeft className="mr-1.5 transition-transform group-hover:-translate-x-1" />
                Return to Store
              </Link>

              {/* Mobile-only brand badge */}
              <div className="lg:hidden flex items-center gap-2">
                {siteData?.image || siteData?.logo ? (
                  <Image
                    src={getImageUrl(siteData?.image || siteData?.logo)}
                    alt={siteData?.siteName || "Store"}
                    width={90}
                    height={30}
                    className="h-7 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-black text-gray-900 tracking-tight">
                    {siteData?.siteName || "Store"}
                  </span>
                )}
              </div>
            </div>

            {/* Header / Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Please enter your credentials to access your account and orders.
              </p>
            </div>

            {/* Contextual Checkout Recovery Notice */}
            {callbackUrl && callbackUrl.includes("checkout") && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 animate-in fade-in">
                <span className="text-base">🛒</span>
                <div>
                  <strong>Checkout in progress:</strong> Sign in now to continue with your saved shipping details.
                </div>
              </div>
            )}

            {/* 1-Click Social Authentication */}
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleGoogleLogin}
                  loading={loadingOAuth === "google"}
                  disabled={loadingOAuth !== null || global.loading.save}
                  className="flex items-center justify-center h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200 shadow-sm group cursor-pointer"
                >
                  <FcGoogle size={20} className="mr-2.5 group-hover:scale-110 transition-transform" />
                  <span>Google</span>
                </Button>

                <Button
                  onClick={handleFacebookLogin}
                  loading={loadingOAuth === "facebook"}
                  disabled={loadingOAuth !== null || global.loading.save}
                  className="flex items-center justify-center h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200 shadow-sm group cursor-pointer"
                >
                  <FaFacebook size={20} className="mr-2.5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </Button>
              </div>

              {/* Elegant Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 bg-white text-gray-400 font-semibold tracking-wider">
                    Or sign in with username
                  </span>
                </div>
              </div>
            </div>

            {/* Authentication Form */}
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              autoComplete="off"
              requiredMark={false}
              className="space-y-4"
            >
              {/* Username Field */}
              <Form.Item
                name="username"
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Username
                  </span>
                }
                rules={[{ required: true, message: "Please enter your username" }]}
                className="mb-3"
              >
                <Input
                  prefix={<FiUser className="text-gray-400 mr-1.5 text-base" />}
                  placeholder="e.g. john.doe"
                  size="large"
                  className="h-12 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                  onInput={() => {
                    if (global.response?.type) dispatch(setResponse({}));
                  }}
                />
              </Form.Item>

              {/* Password Field with Inline Forgot Link */}
              <Form.Item
                name="password"
                label={
                  <div className="flex justify-between items-center w-full">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Password
                    </span>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-global-primary hover:text-global-hover transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                }
                rules={[{ required: true, message: "Please enter your password" }]}
                className="mb-3"
              >
                <Input.Password
                  prefix={<FiLock className="text-gray-400 mr-1.5 text-base" />}
                  placeholder="••••••••"
                  size="large"
                  className="h-12 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                  onInput={() => {
                    if (global.response?.type) dispatch(setResponse({}));
                  }}
                />
              </Form.Item>

              {/* "Remember Me" Row */}
              <div className="flex items-center justify-between pt-1">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="text-xs sm:text-sm text-gray-600 select-none cursor-pointer"
                >
                  Keep me signed in
                </Checkbox>
              </div>

              {/* Feedback / Alert Notice */}
              {global.response?.type && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-1">
                  <Alert
                    className="rounded-xl border border-red-200 font-medium text-xs sm:text-sm"
                    message={global.response.message}
                    type={global.response.type}
                    showIcon
                    closable
                    onClose={() => dispatch(setResponse({}))}
                  />
                </div>
              )}

              {/* High-Conversion Primary CTA */}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={global.loading?.save}
                disabled={loadingOAuth !== null}
                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-global-primary/25 hover:shadow-xl hover:shadow-global-primary/35 transition-all duration-300 transform hover:-translate-y-0.5 mt-2 cursor-pointer"
              >
                Sign In to Your Account
              </Button>
            </Form>

            {/* Registration Navigation */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                href={registerLink}
                className="font-bold text-global-primary hover:text-global-hover transition-colors underline underline-offset-4 ml-1"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* ========================================================================= */}
          {/* Trust & Guarantee Badges Bar */}
          {/* ========================================================================= */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-gray-400 text-[11px] sm:text-xs">
            <div className="flex items-center justify-center gap-1.5">
              <HiOutlineShieldCheck className="text-green-600 text-sm sm:text-base shrink-0" />
              <span className="font-medium text-gray-600">256-Bit SSL</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 border-x border-gray-100">
              <FiCheckCircle className="text-blue-600 text-sm sm:text-base shrink-0" />
              <span className="font-medium text-gray-600">Verified Store</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <HiSparkles className="text-amber-500 text-sm sm:text-base shrink-0" />
              <span className="font-medium text-gray-600">Fast Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
