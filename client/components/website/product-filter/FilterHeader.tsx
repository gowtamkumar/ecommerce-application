"use client";
import {
  selectGlobal,
  setProductFilter,
  setProductView,
} from "@/redux/features/global/globalSlice";
import { selectProduct } from "@/redux/features/products/productSlice";
import { Button, Select } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
export default function FilterHeader() {
  const global = useSelector(selectGlobal);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch();

  const handleSort = (value: any) => {
    if (value === "lowPrice") {
      dispatch(
        setProductFilter({
          ...global.productFilter,
          lowPrice: true,
          highPrice: false,
        })
      );
    } else {
      dispatch(
        setProductFilter({
          ...global.productFilter,
          lowPrice: false,
          highPrice: true,
        })
      );
    }
  };

  return (
    <div className="py-2">
      <div className="flex flex-col md:flex-row justify-between items-center p-4 bg-white  rounded-md">
        {/* Item Count and Filter */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <div className="text-sm text-gray-600">
            {products?.length || 0} items found for
            <span className="text-orange-500 font-semibold">
              Need to show filter category
            </span>
          </div>
        </div>

        {/* Sorting and View Options */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">Sort By:</span>
            <Select
              defaultValue={"Select One"}
              style={{ width: 150 }}
              onChange={(value) => handleSort(value)}
            >
              <Select.Option value="lowPrice">Price Low to High</Select.Option>
              <Select.Option value="highPrice">Price High to Low</Select.Option>
            </Select>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">View:</span>
            <Button
              onClick={() => dispatch(setProductView(false))}
              className="ml-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </Button>
            <Button
              onClick={() => dispatch(setProductView(true))}
              className="ml-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h7M4 10h7M4 14h7M4 18h7"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
