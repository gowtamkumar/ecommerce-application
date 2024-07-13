import React from "react";

const DescriptionProduct = ({ product }: any) => {
  return (
    <div className="text-start">
      <h3 className="text-lg font-bold mb-4">Description</h3>
      <div className="md:flex gap-16 bg-white p-4 items-center">
        <p>{product?.description}</p>
      </div>
    </div>
  );
};

export default DescriptionProduct;
