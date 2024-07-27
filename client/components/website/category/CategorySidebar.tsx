"use client";
import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Rate,
  Slider,
  Space,
} from "antd";
import React from "react";

export default function CategorySidebar() {
  return (
    <aside className="shadow-sm p-2 ">
      <h2 className="text-lg font-bold mb-2">Filters</h2>
      <h2 className="text-lg font-bold mt-4 mb-2">Price</h2>
      <div>
        <Space.Compact>
          <InputNumber placeholder="Min" />
          <InputNumber placeholder="Max" />
          <Button>Apply</Button>
        </Space.Compact>
      </div>

      <ul className="space-y-2">
        <li className="font-semibold border-b-2">Category</li>
        {[
          "Red",
          "Green",
          "Yellow",
          "Daraz Verified",
          "Cash On Delivery",
          "Installment",
        ].map((item, index) => (
          <li key={index}>
            <label className="flex items-center">
              <Checkbox>{item}</Checkbox>
            </label>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold mt-4 mb-2">Discount</h2>
      <div>
        <Slider />
      </div>

      <ul className="space-y-2">
        <li className="font-semibold border-b-2">Brand</li>
        {[
          "Free Delivery",
          "Hot Deals",
          "Authentic Brands",
          "Daraz Verified",
          "Cash On Delivery",
          "Installment",
        ].map((item, index) => (
          <li key={index}>
            <label className="flex items-center">
              <Checkbox>{item}</Checkbox>
            </label>
          </li>
        ))}
      </ul>

      <ul className="space-y-2">
        <li className="font-semibold border-b-2">Color Family</li>
        {[
          "Red",
          "Green",
          "Yellow",
          "Daraz Verified",
          "Cash On Delivery",
          "Installment",
        ].map((item, index) => (
          <li key={index}>
            <label className="flex items-center">
              <Checkbox>{item}</Checkbox>
              {/* <input type="checkbox" className="mr-2" />  */}
            </label>
          </li>
        ))}
      </ul>

      <ul className="space-y-2">
        <li className="font-semibold border-b-2">Rating</li>
        {["1", "2", "3", "4", "5"].map((item, index) => (
          <li key={index}>
            <label className="flex items-center">
              <Rate value={+item} />
              {/* <input type="checkbox" className="mr-2" />  */}
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
}
