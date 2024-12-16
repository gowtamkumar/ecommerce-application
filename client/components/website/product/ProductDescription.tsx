import { selectProduct } from "@/redux/features/products/productSlice";
import { useSelector } from "react-redux";

const ProductDescription= () => {
  const products = useSelector(selectProduct);
  return (
    <div className="text-start">
      <h3 className="text-lg font-bold mb-4">Description</h3>
      <div className="md:flex gap-16 bg-white p-4 items-center">
        <div
          className="text-gray-700 mb-4 leading-6"
          dangerouslySetInnerHTML={{
            __html: products.product.description,
          }}
        />
      </div>
    </div>
  );
};

export default ProductDescription;
