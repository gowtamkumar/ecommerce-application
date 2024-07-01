// src/components/ProductActions.js
import { Button, Input, InputNumber } from "antd";
import React, { useState } from "react";

const ProductActions = () => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="w-60 flex items-center mb-4">
      <span className="text-gray-600"> Quantity: </span>
      <Button
        onClick={decreaseQuantity}
        className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300 focus:outline-none"
      >
        -
      </Button>
      <Input
        type="number"
        value={quantity}
        readOnly
        className="w-12 text-center border-t border-b border-gray-300"
      />
      <Button
        onClick={increaseQuantity}
        className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300 focus:outline-none"
      >
        +
      </Button>
    </div>
  );
};

export default ProductActions;
