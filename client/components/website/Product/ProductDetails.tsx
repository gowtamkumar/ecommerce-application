// src/components/ProductDetails.js
import { Button, Divider, Rate } from "antd";
import Link from "next/link";
import React from "react";
import ProductActions from "./ProductActions";

const ProductDetails = ({ product }: any) => {
  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <h2>
        <Rate allowHalf defaultValue={2.5} />
        37 Ratings
      </h2>
      <h2>
        Brand: <a href="#">Brand</a> More Watches from No Brand
      </h2>
      <p className="text-gray-700 mb-4">{product.description}</p>

      <div className="flex items-center mb-4">
        <span className="text-2xl font-semibold text-blue-600 mr-4">
          ৳ {product.price}
        </span>
        <span className="line-through text-gray-500">
          ৳ {product.originalPrice}
        </span>
        <span className="text-green-600 ml-2">- {product.discount}%</span>
      </div>
      <Divider />
      <div className="mb-4">
        <span className="text-gray-600">Color Family: </span>
        {product.colors.map((color: string, index: number) => (
          <button
            key={index}
            className="mr-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
          >
            {color}
          </button>
        ))}
      </div>
      <ProductActions />
      <Divider />
      <Button size="large" type="primary">
        Add to Cart
      </Button>
      <Divider />

    </div>
  );
};

export default ProductDetails;
