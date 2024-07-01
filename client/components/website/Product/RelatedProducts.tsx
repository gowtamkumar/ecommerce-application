/* eslint-disable @next/next/no-img-element */
import React from 'react';

const RelatedProducts = ({ products }: any) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-4">Related Products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
            <img className="w-full h-32 object-cover rounded-md mb-2" src={product.image} alt={product.name} />
            <h4 className="text-lg font-semibold mb-1">{product.name}</h4>
            <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
