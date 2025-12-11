
const ProductModal = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 md:flex md:gap-6">
        {/* Left Section - Product Images */}
        <div className="flex flex-col gap-4 md:w-1/2">
          <img
            src="https://via.placeholder.com/300"
            alt="Main Product"
            className="rounded-lg w-full"
          />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((item) => (
              <img
                key={item}
                src={`https://via.placeholder.com/70`}
                alt={`Thumbnail ${item}`}
                className="w-16 h-16 rounded-lg border border-gray-300 cursor-pointer hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Praesent in ante
          </h2>
          <p className="text-red-500 text-lg font-semibold mb-2">$129.00</p>
          <p className="text-gray-600 mb-4">
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae.
          </p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-gray-600 font-medium">Size:</span>
            {["Small", "Medium", "Large", "Extra Large"].map((size) => (
              <button
                key={size}
                className="px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400"
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-green-600 font-medium mb-4">In stock 300 items</p>
          <div className="flex items-center gap-2 mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add to Cart
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Buy Now
            </button>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <button className="text-gray-600 underline">Add to Compare</button>
            <button className="text-gray-600 underline">Add to Wishlist</button>
          </div>
          <p className="text-gray-500 mb-4">SKU: PD0021</p>
          <div className="flex items-center gap-4">
            <span>Share:</span>
            <a href="#" className="text-blue-500">
              Facebook
            </a>
            <a href="#" className="text-blue-400">
              Twitter
            </a>
            <a href="#" className="text-pink-500">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
