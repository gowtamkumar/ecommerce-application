import Image from "next/image";

const PopularProduct = () => {
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[2, 4, 7, 8, 5, 6, 7, 7].map((item, idx) => (
            <>
              <div className="bg-white rounded-lg shadow-md p-4">
                <Image
                  width={150}
                  height={150}
                  src="/product-01.jpg"
                  alt="Category Image"
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{item}</h3>
                <p className="text-gray-500 mb-2">${item}</p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add to Cart
                </button>
              </div>
            </>
          ))}
        </div>
      </section>
    </>
  );
};

export default PopularProduct;
