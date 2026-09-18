import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Register = dynamic(() => import("@/components/website/register/Register"));

export const metadata: Metadata = {
  title: "Register | Create Your Account",
  description: "Join us today to unlock exclusive member discounts, real-time order tracking, and express checkout.",
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
          <Register />
        </Suspense>
      </main>
      <WebFooter />
    </>
  );
}
