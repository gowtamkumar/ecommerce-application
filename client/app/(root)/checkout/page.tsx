import { auth } from "@/auth";
// import ScrollToCart from "@/components/website/ScrollToCart";
// import { authOptions } from "@/lib/authOption";
// import { getServerSession } from "next-auth";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const Header = dynamic(() => import("@/components/website/header/Header"));
const CheckoutPage = dynamic(
  () => import("@/components/website/checkout/CheckoutPage")
);
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export const metadata: Metadata = {
  title: "Checkout",
  description: "...",
};

export default async function CheckOut() {
  // const session: any = useSession();
  // if (session.status === "unauthenticated") {
  //   redirect("/login");
  // }

  const session: any = await auth();

  if (!session?.token) {
    redirect("/login");
  }

  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <CheckoutPage />
      </div>
      {/* <ScrollToCart /> */}
      <WebFooter />
    </>
  );
}
