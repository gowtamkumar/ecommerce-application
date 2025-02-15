import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));
const CheckoutPage = dynamic(() => import("@/components/website/checkout/CheckoutPage"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export default function CheckOut() {
  return (
    <>
      <Header />
      <div className="bg-gray-100">
        <CheckoutPage />
      </div>
      <WebFooter/>
    </>
  );
}
