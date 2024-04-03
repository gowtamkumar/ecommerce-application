import Image from "next/image";

const CategoryCard = ({ imageUrl, categoryName }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Image
        // placeholder="blur"
        width={150}
        height={150}
        src="/product-02.jpg"
        alt="Category Image"
        className="w-full h-48 object-cover mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{categoryName}</h3>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Shop Now
      </button>
    </div>
  );
};

export default CategoryCard;
