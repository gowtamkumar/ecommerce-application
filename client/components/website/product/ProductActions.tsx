// src/components/ProductActions.js
import { decrementCart, incrementCart } from "@/redux/features/cart/cartSlice";
import { Button, Input } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

const ProductActions = ({ product, setProduct }: any) => {
  const dispatch = useDispatch();

  return (
    <div className="w-60 flex items-center mb-4">
      <span className="text-gray-600"> Quantity: </span>
      <Button
        onClick={() => {
          dispatch(decrementCart(product));
          setProduct({
            ...product,
            qty: product?.qty - 1,
          });
        }}
        className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 focus:outline-none"
      >
        -
      </Button>
      <Input
        type="number"
        value={product?.qty}
        readOnly
        className="w-12 text-center border-t border-b border-gray-300"
      />
      <Button
        onClick={() => {
          dispatch(incrementCart(product));
          setProduct({
            ...product,
            qty: product?.qty + 1,
          });
        }}
        className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 focus:outline-none"
      >
        +
      </Button>
    </div>
  );
};

export default ProductActions;
