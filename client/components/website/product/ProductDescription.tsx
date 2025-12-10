import { selectProduct } from "@/redux/features/products/productSlice";
import { useSelector } from "react-redux";

const ProductDescription = () => {
  const products = useSelector(selectProduct);
  return (
    <div className="text-start">
      <h3 className="text-2xl font-bold mb-8 font-global-primary-fontfamily text-gray-900">Description</h3>
      <div className="bg-white rounded-2xl p-0">
        <div
          className="prose max-w-none text-gray-600 leading-relaxed font-global-secondary-fontfamily
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-p:mb-4 prose-p:leading-7 
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{
            __html: products.product.description,
          }}
        />
      </div>
    </div>
  );
};

export default ProductDescription;
