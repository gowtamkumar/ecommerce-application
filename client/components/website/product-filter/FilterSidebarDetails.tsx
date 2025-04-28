"use client";
import React, { useState } from "react";
import {
  selectGlobal,
  setProductFilter,
} from "@/redux/features/global/globalSlice";
import {
  Button,
  Checkbox,
  Divider,
  InputNumber,
  Slider,
  SliderSingleProps,
  Space,
} from "antd";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";

interface Category {
  name: string;
  id: number;
}

interface Brands {
  name: string;
  id: number;
}

interface Colors {
  name: string;
  color: string;
  id: number;
}

export default function FilterSidebarDetails({
  categories,
  brands,
  colors,
}: {
  categories: [Category];
  brands: [Brands];
  colors: [Colors];
}) {
  const [filterData, setFilter] = useState<any>({});
  const dispatch = useDispatch();

  const handleFilter = () => {
    dispatch(setProductFilter(filterData));
  };

  const handelChange = (value: any, name: string) => {
    setFilter({ ...filterData, [name]: value });
  };

  const filterClear = () => {
    dispatch(setProductFilter({}));
    setFilter({});
  };

  interface Option {
    label: string;
    value: string;
  }

  const marks: SliderSingleProps["marks"] = {
    0: "0%",
    100: "100%",
  };

  return (
    <aside className="rounded-lg bg-gray-100 p-3 text-center">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold md:mb-2">Filters</h2>
        <div>
          <Button className="me-2" onClick={filterClear}>
            Clear
          </Button>
          <Button onClick={handleFilter}>Filter</Button>
        </div>
      </div>

      <Divider orientation="left" className="font-semibold">
        <p className="font-semibold">Price</p>
      </Divider>

      <Space.Compact block>
        <InputNumber
          placeholder="Min"
          value={filterData.minPrice}
          onChange={(value) => handelChange(value, "minPrice")}
        />
        <InputNumber
          placeholder="Max"
          value={filterData.maxPrice}
          onChange={(value) => handelChange(value, "maxPrice")}
        />
      </Space.Compact>

      <Divider orientation="left" className="font-semibold">
        <p className="font-semibold">Discount </p>
      </Divider>
      <div className="px-3">
        <Slider
          marks={marks}
          value={filterData.discount}
          // onChange={(value) => handleFilter(value, "discount")}
          onChange={(value) => handelChange(value, "discount")}
        />
      </div>

      <ul className="space-y-2">
        <Divider orientation="left" className="font-semibold">
          <p className="font-semibold">Category </p>
        </Divider>
        <li>
          <label className="flex flex-col">
            <Checkbox.Group
              name="categoryId"
              value={
                filterData?.categoryId?.length
                  ? filterData?.categoryId
                  : filterData?.categoryId?.toString()
              }
              options={(categories || []).map((item): any => ({
                label: item.name,
                value: item.id.toString(),
              }))}
              onChange={(value) => handelChange(value, "categoryId")}
            />
          </label>
        </li>
      </ul>

      <ul className="space-y-2">
        <Divider orientation="left">
          <p className="font-semibold">Brands</p>
        </Divider>
        <li>
          <label className="flex items-center">
            <Checkbox.Group
              name="brandId"
              value={filterData.brandId}
              options={(brands || []).map(
                (item): Option => ({
                  label: item.name,
                  value: item.id.toString(),
                })
              )}
              onChange={(value) => handelChange(value, "brandId")}
            />
          </label>
        </li>
      </ul>

      <ul className="space-y-2">
        <Divider orientation="left" className="font-semibold">
          Color Family
        </Divider>
        <li>
          <label className="flex items-center">
            <Checkbox.Group
              name="colorId"
              value={filterData.colorId}
              options={(colors || []).map(
                (item): Option => ({
                  label: item.name,
                  value: item.id.toString(),
                })
              )}
              onChange={(value) => handelChange(value, "colorId")}
            />
          </label>
        </li>
      </ul>

      {/* <ul className="space-y-2 pb-3">
        <Divider orientation="left" className="font-semibold">
          <p className="font-semibold">Rating </p>
        </Divider>
        <li>
          <label className="flex items-center">
            <Rate
              value={global.productFilter.rating}
              onChange={(value) => handleFilter(value, "rating")}
            />
          </label>
        </li>
      </ul> */}
    </aside>
  );
}
