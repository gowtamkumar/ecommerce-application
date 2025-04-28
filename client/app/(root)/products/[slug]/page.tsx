import ScrollToCart from "@/components/website/ScrollToCart";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const SingleProduct = dynamic(
  () => import("@/components/website/product/SingleProduct")
);

export default function Product() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <SingleProduct />
      </div>
      <ScrollToCart />
      <WebFooter />
    </>
  );
}
