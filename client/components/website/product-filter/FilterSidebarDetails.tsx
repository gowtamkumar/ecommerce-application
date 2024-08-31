"use client";
import {
  selectGlobal,
  setProductFilter,
} from "@/redux/features/global/globalSlice";
import {
  Button,
  Checkbox,
  Divider,
  InputNumber,
  Rate,
  Slider,
  SliderSingleProps,
  Space,
} from "antd";
import React, { useState } from "react";
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
  const [price, setPrice] = useState({} as any);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const handleFilter = (value: any, name: string) => {
    dispatch(setProductFilter({ ...global.productFilter, [name]: value }));
  };

  const filterClear = () => {
    dispatch(setProductFilter({}));
    setPrice({});
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
    <aside className="shadow-sm">
      <div className="flex justify-between">
        <h2 className="text-lg font-bold mb-2">Filters</h2>
        <Button onClick={filterClear}>Clear</Button>
      </div>

      <Divider orientation="left" className="font-semibold">
        <p className="font-semibold">Price </p>
      </Divider>
      <div className="flex">
        {/* <Space.Compact> */}
        <InputNumber
          placeholder="Min"
          value={price.minPrice}
          onChange={(value) => setPrice({ ...price, minPrice: value })}
        />
        <InputNumber
          placeholder="Max"
          value={price.maxPrice}
          onChange={(value) => setPrice({ ...price, maxPrice: value })}
        />

        {/* </Space.Compact> */}
      </div>
      <Button
        onClick={() => {
          dispatch(setProductFilter({ ...global.productFilter, ...price }));
        }}
        type="default"
      // style={{ width: '100%' }}
      >
        Apply
      </Button>

      <Divider orientation="left" className="font-semibold">
        <p className="font-semibold">Discount </p>
      </Divider>
      <Slider
        marks={marks}
        value={global.productFilter.discount}
        onChange={(value) => handleFilter(value, "discount")}
      />

      <ul className="space-y-2">
        <Divider orientation="left" className="font-semibold">
          <p className="font-semibold">Category </p>
        </Divider>
        <li>
          <label className="flex items-center">
            <Checkbox.Group
              name="categoryId"
              value={
                global.productFilter?.categoryId?.length
                  ? global.productFilter?.categoryId
                  : global.productFilter?.categoryId?.toString()
              }
              options={(categories || []).map(
                (item): Option => ({
                  label: item.name,
                  value: item.id.toString(),
                })
              )}
              onChange={(value) => handleFilter(value, "categoryId")}
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
              value={global.productFilter.brandId}
              options={(brands || []).map(
                (item): Option => ({
                  label: item.name,
                  value: item.id.toString(),
                })
              )}
              onChange={(value) => handleFilter(value, "brandId")}
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
              value={global.productFilter.colorId}
              options={(colors || []).map(
                (item): Option => ({
                  label: item.name,
                  value: item.id.toString(),
                })
              )}
              onChange={(value) => handleFilter(value, "colorId")}
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
