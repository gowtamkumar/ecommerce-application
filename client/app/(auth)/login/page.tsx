import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Header = dynamic(() => import("@/components/website/header/Header"));
const Login = dynamic(() => import("@/components/website/login/Login"));

export const metadata: Metadata = {
  title: "Login | Secure Member Sign In",
  description: "Sign in to access your account, track orders, and unlock member rewards.",
  robots: { index: false, follow: false },
};

export default function page() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 py-8 sm:py-12 lg:py-16">
        <Suspense
          fallback={
            <div className="min-h-[500px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-global-primary border-t-transparent" />
            </div>
          }
        >
          <Login />
        </Suspense>
      </main>
      <WebFooter />
    </>
  );
}
