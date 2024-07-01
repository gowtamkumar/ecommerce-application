import Header from "@/components/website/Header/Header";
import SingleProduct from "@/components/website/Product/SingleProduct";
export default async function Product() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <SingleProduct />
      </div>
    </>

  );
}
