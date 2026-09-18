"use client";
import { saveUser } from "@/lib/apis/user";
import { getImageUrl } from "@/lib/utils/imageUrl";
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
    FiMail,
    FiShield,
    FiUser,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { HiOutlineGift, HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const global = useSelector(selectGlobal);
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [loadingOAuth, setLoadingOAuth] = useState<"google" | "facebook" | null>(null);

  // Retrieve callback destination (e.g. returning to checkout)
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const siteData = global.setting || {};

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        if (callbackUrl && callbackUrl !== "/login" && callbackUrl !== "/register") {
          router.replace(callbackUrl);
        } else {
          router.replace("/");
        }
      }
    })();
  }, [callbackUrl, router]);

  const handleSubmit = async (values: any) => {
    dispatch(setLoading({ save: true }));
    try {
      // Clean payload for user registration
      const userData = {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      };
      const result = await saveUser(userData);

      if (result?.success) {
        dispatch(
          setResponse({
            type: "success",
            message: "Account created successfully! Please sign in to continue.",
          })
        );
        const loginTarget = callbackUrl
          ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
          : "/login";
        router.push(loginTarget);
      } else {
        dispatch(
          setResponse({
            type: "error",
            message: result?.message || "Registration failed. Please check your inputs.",
          })
        );
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      dispatch(
        setResponse({
          type: "error",
          message: "Something went wrong while creating your account. Please try again.",
        })
      );
    } finally {
      dispatch(setLoading({ save: false }));
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoadingOAuth("google");
      await signIn("google", {
        callbackUrl: callbackUrl && callbackUrl !== "/register" ? callbackUrl : `${window.location.origin}`,
      });
    } catch (err) {
      console.error("Google sign up error:", err);
      dispatch(
        setResponse({
          type: "error",
          message: "Failed to sign up with Google. Please try again.",
        })
      );
      setLoadingOAuth(null);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      setLoadingOAuth("facebook");
      await signIn("facebook", {
        callbackUrl: callbackUrl && callbackUrl !== "/register" ? callbackUrl : `${window.location.origin}`,
      });
    } catch (err) {
      console.error("Facebook sign up error:", err);
      dispatch(
        setResponse({
          type: "error",
          message: "Failed to sign up with Facebook. Please try again.",
        })
      );
      setLoadingOAuth(null);
    }
  };

  const loginLink = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Elevated Card with Split-Screen Layout */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/80 border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: New Member Value Proposition Showcase (Desktop) */}
        {/* ========================================================================= */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-12 overflow-hidden bg-gray-950 text-white select-none">
          {/* Background Image with Atmospheric Lighting */}
          <Image
            src="/login_bg.png"
            alt="Join Our Store"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
          />

          {/* Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-gray-950/30" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-global-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand & Welcome Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-white shadow-sm">
              <HiOutlineGift className="text-global-primary text-sm animate-pulse" />
              <span>New Member Welcome</span>
            </div>

            <h2 className="mt-6 text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              Join Our Global Shopping Community.
            </h2>
            <p className="mt-3 text-sm xl:text-base text-gray-300 font-normal leading-relaxed max-w-md">
              Create your account today to unlock welcome discounts, express checkout, and personalized recommendations.
            </p>
          </div>

          {/* Middle: Welcome Perks */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-global-primary/20 border border-global-primary/30 flex items-center justify-center shrink-0 text-global-primary">
                <HiOutlineGift className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Instant Welcome Privilege</h4>
                <p className="text-xs text-gray-300 mt-0.5">Enjoy special introductory discounts on your first order after signing up.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-global-primary/20 border border-global-primary/30 flex items-center justify-center shrink-0 text-global-primary">
                <HiOutlineTruck className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">1-Click Fast Checkout</h4>
                <p className="text-xs text-gray-300 mt-0.5">Securely store your delivery addresses for frictionless purchases every time.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-global-primary/20 border border-global-primary/30 flex items-center justify-center shrink-0 text-global-primary">
                <FiShield className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Buyer Protection Guarantee</h4>
                <p className="text-xs text-gray-300 mt-0.5">All orders covered with full warranty, authentic quality, and simple returns.</p>
              </div>
            </div>
          </div>

          {/* Bottom: Social Proof */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-sm">
                {"★★★★★"}
              </div>
              <span className="text-xs font-semibold text-white">4.9 / 5.0</span>
            </div>
            <span className="text-xs text-gray-300">
              Joined by <strong className="text-white">50,000+</strong> members worldwide
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Modern Registration Form */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-10 xl:p-12">
          <div>
            {/* Top Navigation */}
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

            {/* Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Create Your Account
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Join in seconds to access orders, save items, and earn member rewards.
              </p>
            </div>

            {/* Contextual Checkout Notice */}
            {callbackUrl && callbackUrl.includes("checkout") && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 animate-in fade-in">
                <span className="text-base">🛒</span>
                <div>
                  <strong>Complete your order:</strong> Register now to proceed directly to checkout.
                </div>
              </div>
            )}

            {/* 1-Click Social Sign-Up */}
            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleGoogleSignup}
                  loading={loadingOAuth === "google"}
                  disabled={loadingOAuth !== null || global.loading.save}
                  className="flex items-center justify-center h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200 shadow-sm group cursor-pointer"
                >
                  <FcGoogle size={20} className="mr-2.5 group-hover:scale-110 transition-transform" />
                  <span>Google</span>
                </Button>

                <Button
                  onClick={handleFacebookSignup}
                  loading={loadingOAuth === "facebook"}
                  disabled={loadingOAuth !== null || global.loading.save}
                  className="flex items-center justify-center h-12 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200 shadow-sm group cursor-pointer"
                >
                  <FaFacebook size={20} className="mr-2.5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 bg-white text-gray-400 font-semibold tracking-wider">
                    Or register with email
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              autoComplete="off"
              requiredMark={false}
              className="space-y-3"
            >
              {/* Row 1: Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Form.Item
                  name="name"
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Full Name
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter your full name" }]}
                  className="!mb-0"
                >
                  <Input
                    prefix={<FiUser className="text-gray-400 mr-1.5 text-base" />}
                    placeholder="John Doe"
                    size="large"
                    className="h-11 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                    onInput={() => {
                      if (global.response?.type) dispatch(setResponse({}));
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="username"
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Username
                    </span>
                  }
                  rules={[
                    { required: true, message: "Username is required" },
                    { min: 5, message: "Min 5 characters" },
                  ]}
                  className="!mb-0"
                >
                  <Input
                    prefix={<FiUser className="text-gray-400 mr-1.5 text-base" />}
                    placeholder="johndoe123"
                    size="large"
                    className="h-11 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                    onInput={() => {
                      if (global.response?.type) dispatch(setResponse({}));
                    }}
                  />
                </Form.Item>
              </div>

              {/* Row 2: Email Address */}
              <Form.Item
                name="email"
                label={
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Email Address
                  </span>
                }
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
                className="!mb-0"
              >
                <Input
                  prefix={<FiMail className="text-gray-400 mr-1.5 text-base" />}
                  placeholder="john@example.com"
                  size="large"
                  className="h-11 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                  onInput={() => {
                    if (global.response?.type) dispatch(setResponse({}));
                  }}
                />
              </Form.Item>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Form.Item
                  name="password"
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Password
                    </span>
                  }
                  rules={[
                    { required: true, message: "Password is required" },
                    { min: 6, message: "Min 6 characters" },
                  ]}
                  className="!mb-0"
                >
                  <Input.Password
                    prefix={<FiLock className="text-gray-400 mr-1.5 text-base" />}
                    placeholder="••••••••"
                    size="large"
                    className="h-11 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                    onInput={() => {
                      if (global.response?.type) dispatch(setResponse({}));
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label={
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Confirm Password
                    </span>
                  }
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Passwords do not match"));
                      },
                    }),
                  ]}
                  className="!mb-0"
                >
                  <Input.Password
                    prefix={<FiLock className="text-gray-400 mr-1.5 text-base" />}
                    placeholder="••••••••"
                    size="large"
                    className="h-11 rounded-xl border-gray-300 text-sm focus:border-global-primary focus:ring-2 focus:ring-global-primary/20"
                    onInput={() => {
                      if (global.response?.type) dispatch(setResponse({}));
                    }}
                  />
                </Form.Item>
              </div>

              {/* Terms of Service & Privacy Policy Checkbox */}
              <Form.Item
                name="agreeTerms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Please accept the terms to proceed")),
                  },
                ]}
                className="!mb-2 pt-1"
              >
                <Checkbox className="text-xs text-gray-600 select-none">
                  I agree to the{" "}
                  <Link
                    href="/terms-conditions"
                    target="_blank"
                    className="text-global-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    target="_blank"
                    className="text-global-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Checkbox>
              </Form.Item>

              {/* Feedback Alert */}
              {global.response?.type && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
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

              {/* Primary Submit CTA */}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={global.loading?.save}
                disabled={loadingOAuth !== null}
                className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-global-primary/25 hover:shadow-xl hover:shadow-global-primary/35 transition-all duration-300 transform hover:-translate-y-0.5 mt-1 cursor-pointer"
              >
                Create Your Account
              </Button>
            </Form>

            {/* Existing User Login Link */}
            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href={loginLink}
                className="font-bold text-global-primary hover:text-global-hover transition-colors underline underline-offset-4 ml-1"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* ========================================================================= */}
          {/* Trust & Guarantee Badges Bar */}
          {/* ========================================================================= */}
          <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-gray-400 text-[11px] sm:text-xs">
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
              <span className="font-medium text-gray-600">Buyer Protected</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;