"use client";
import { Button, Divider, Input, Rate, Tag } from "antd";
import React, { useEffect, useState } from "react";
import ProductActions from "./ProductActions";
import { useDispatch } from "react-redux";
import {
  addCart,
  decrementCart,
  incrementCart,
} from "@/redux/features/cart/cartSlice";
import { useParams, useRouter } from "next/navigation";
import { getProduct } from "@/lib/apis/product";
import Link from "next/link";

const ProductDetails = () => {
  const [product, setProduct] = useState({} as any);
  const dispatch = useDispatch();
  const route = useRouter();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const newProduct = await getProduct(id.toString());
      setProduct({
        ...newProduct?.data,
        qty: 1,
        selectProductVarient: newProduct?.data?.productVariants[0],
      });
    })();
  }, [dispatch, id]);

  return (
    <div className="p-4 ">
      <h1 className="text-2xl font-bold mb-2">{product?.name}</h1>
      <h2>
        <Rate allowHalf defaultValue={2.5} />
        37 Ratings
      </h2>
      <h2>
        Brand:
        <Link href={`/brand/${product?.brand?.id}`}>
          {product?.brand?.name}
        </Link>
      </h2>
      <p className="text-gray-700 mb-4">{product?.description}</p>

      <div className="flex items-center mb-4">
        <span className="text-2xl font-semibold text-blue-600 mr-4">
          ৳ {product.selectProductVarient?.salePrice}
        </span>
        <span className="line-through text-gray-500">
          ৳ {product.selectProductVarient?.regularPrice}
        </span>
        <span className="text-green-600 ml-2">- {product?.discount}%</span>
      </div>
      <Divider />
      {product?.productVariants?.length && (
        <div className="mb-4">
          <span className="text-gray-600">Color Family: </span>
          {product?.productVariants?.map((item: any, idx: number) => (
            <button
              key={idx}
              onClick={() =>
                setProduct({
                  ...product,
                  selectProductVarient: item,
                })
              }
              style={{ backgroundColor: `${item.color?.color}` }}
              className="mr-2 px-2 py-1 rounded bg-gray-200 text-white hover:bg-gray-300 focus:outline-none"
            >
              {item.color?.name}
            </button>
          ))}
        </div>
      )}

      {product?.productVariants?.length && (
        <div className="mb-4">
          <span className="text-gray-600">Size </span>
          {product?.productVariants?.map((item: any, idx: number) => (
            <Button
              key={idx}
              onClick={() =>
                setProduct({
                  ...product,
                  selectProductVarient: item,
                })
              }
              className="mr-2 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none"
            >
              {item.size?.name}
            </Button>
          ))}
        </div>
      )}

      {/* product Action section */}
      <div className="w-60 flex items-center mb-4">
        <span className="text-gray-600"> Quantity: </span>
        <Button
          onClick={() => {
            dispatch(decrementCart(product));
            setProduct({
              ...product,
              qty: product.qty - 1,
            });
          }}
          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 focus:outline-none"
        >
          -
        </Button>
        <Input
          type="number"
          value={product.qty}
          readOnly
          className="w-12 text-center border-t border-b border-gray-300"
        />
        <Button
          onClick={() => {
            dispatch(incrementCart(product));
            setProduct({
              ...product,
              qty: product.qty + 1,
            });
          }}
          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 focus:outline-none"
        >
          +
        </Button>
      </div>

      {/* <ProductActions /> */}
      <Divider />
      <div className="flex gap-x-5">
        <Button
          type="primary"
          size="large"
          onClick={() => dispatch(addCart(product))}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add to Cart
        </Button>
        <Button size="large" type="default">
          Add to Wishlist
        </Button>
      </div>
      <Divider />
    </div>
  );
};

export default ProductDetails;
