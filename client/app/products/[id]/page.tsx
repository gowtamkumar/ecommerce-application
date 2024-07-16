import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";
import SingleProduct from "@/components/website/product/SingleProduct";
export default function Product() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <SingleProduct />
      </div>
      <WebFooter />
    </>
  );
}
