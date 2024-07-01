/* eslint-disable @next/next/no-img-element */
import { Divider, Rate } from "antd";
import React from "react";

const RatingProduct = ({ products }: any) => {
  return (
    <div className="mt-8 text-start">
      <h3 className="text-lg font-bold mb-4">Ratings & Reviews</h3>
      <div className="md:flex gap-16 bg-white p-4 items-center">
        <div>
          <p className="text-2xl font-bold">3.1</p>
          <Rate allowHalf defaultValue={2.5} />
          <p>37 ratings</p>
        </div>

        <Divider
          type="vertical"
          style={{
            height: "100px",
          }}
        />

        <div className="text-start">
          <Rate allowHalf defaultValue={2.5} />
          <br />
          <Rate allowHalf defaultValue={2.5} />
          <br />
          <Rate allowHalf defaultValue={2.5} />
          <br />
          <Rate allowHalf defaultValue={2.5} />
          <br />
          <Rate allowHalf defaultValue={2.5} />
          <br />
        </div>
      </div>
    </div>
  );
};

export default RatingProduct;
