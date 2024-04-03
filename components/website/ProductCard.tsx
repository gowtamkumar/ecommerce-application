import Image from "next/image";

const ProductCard = ({ imageUrl, productName, price }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Image
        // placeholder="blur"
        width={150}
        height={150}
        src="/product-01.jpg"
        alt="Category Image"
        className="w-full h-48 object-cover mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{productName}</h3>
      <p className="text-gray-500 mb-2">${price}</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;