/* eslint-disable @next/next/no-img-element */
import { Divider, Rate } from "antd";
import React from "react";

const DescriptionProduct = ({ products }: any) => {
  return (
    <div className="mt-8 text-start">
      <h3 className="text-lg font-bold mb-4">Description</h3>
      <div className="md:flex gap-16 bg-white p-4 items-center">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, sapiente delectus iure suscipit ab velit. Totam eveniet incidunt, error magni odio labore quos placeat aliquid aut? Impedit quae magnam nulla.</p>
      </div>
    </div>
  );
};

export default DescriptionProduct;
