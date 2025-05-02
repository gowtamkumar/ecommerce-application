"use client";
import React, { useEffect, useState } from "react";
import { setProductFilter } from "@/redux/features/global/globalSlice";
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
import { useDispatch } from "react-redux";
import { getPublicCategories } from "@/lib/apis/categories";
import { getBrands } from "@/lib/apis/brand";
import { getColors } from "@/lib/apis/color";
import { setOpen } from "@/redux/features/layout/layoutSlice";

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

export default function FilterSidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [colors, setColors] = useState<Colors[]>([]);
  const [filterData, setFilter] = useState<any>({});
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const category = await getPublicCategories();
    setCategories(category.data);
    const brands = await getBrands();
    setBrands(brands.data);
    const colors = await getColors();
    setColors(colors.data);
  };

  const handleFilter = () => {
    dispatch(setProductFilter(filterData));
    dispatch(setOpen(false));
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
        <Button className="me-2" onClick={filterClear}>
          Clear
        </Button>
        <Button onClick={handleFilter}>Filter</Button>
      </div>

      <Divider orientation="left" className="font-semibold">
        <p className="font-semibold">Price</p>
      </Divider>
      <Space.Compact block className="w-full">
        <InputNumber
          placeholder="Min"
          style={{ flex: 1 }}
          value={filterData.minPrice}
          onChange={(value) => handelChange(value, "minPrice")}
        />
        <InputNumber
          placeholder="Max"
          style={{ flex: 1 }}
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
          onChange={(value) => handelChange(value, "discount")}
        />
      </div>

      <ul className="space-y-2">
        <Divider orientation="left" className="font-semibold">
          <p className="font-semibold">Category </p>
        </Divider>
        <li>
          <Checkbox.Group
            name="categoryId"
            className="w-full text-left flex flex-col gap-2"
            value={
              filterData?.categoryId?.length
                ? filterData?.categoryId
                : filterData?.categoryId?.toString()
            }
            options={(categories || []).map(
              (item: { name: string; id: number | string }): Option => ({
                label: item.name,
                value: item.id.toString(),
              })
            )}
            onChange={(value) => handelChange(value, "categoryId")}
          />
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
              className="w-full text-left flex flex-col gap-2"
              value={filterData.brandId}
              options={(brands || []).map(
                (item: { name: string; id: number | string }): Option => ({
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
              className="w-full text-left flex flex-col gap-2"
              value={filterData.colorId}
              options={(colors || []).map(
                (item: { name: string; id: number | string }): Option => ({
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
