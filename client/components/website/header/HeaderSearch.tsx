"use client";
import { useEffect, useState } from "react";
import {
  setProductFilter,
  setProductView,
} from "@/redux/features/global/globalSlice";
import { Input, Select } from "antd";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderSearch({ categories = [] }: any) {
  const [serach, setSearch] = useState({} as any);
  // hook
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { Search } = Input;

  useEffect(() => {
    const ValidPath = ["products", "category"].includes(pathname.split("/")[1]);
    if (!ValidPath) {
      localStorage.removeItem("searchData");
    }
    dispatch(setProductFilter({}));
    dispatch(setProductView(false)); // this state use for product grid
  }, [pathname, dispatch]);

  const getData =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage?.getItem("searchData") || "{}")
      : {};

  const selectBefore = (
    <Select
      // defaultValue="Select Category"
      value={getData.categoryId}
      onChange={(value) => {
        if (getData) {
          localStorage.setItem(
            "searchData",
            JSON.stringify({ ...getData, categoryId: value })
          );
        } else {
          localStorage.setItem(
            "searchData",
            JSON.stringify({ categoryId: value })
          );
        }
        setSearch({ ...serach, categoryId: value });
      }}
      allowClear
    >
      {(categories?.data || []).map((categoroy: any) => (
        <Select.Option key={categoroy.id} value={categoroy.id}>
          {categoroy.name}
        </Select.Option>
      ))}
    </Select>
  );
  return (
    <div className="w-8/12">
      <Search
        addonBefore={selectBefore}
        width={100}
        value={getData.search}
        size="middle"
        onSearch={() => {
          let queryRouter = "";
          if (getData.categoryId) {
            queryRouter += `categoryId=${getData.categoryId}&`;
          }
          if (getData.search) {
            queryRouter += `search=${getData.search}&`;
          }
          router.push(`/products?${queryRouter}`);

          // dispatch(
          //   setProductFilter({
          //     ...global.productFilter,
          //     categoryId: getData.categoryId,
          //     search: getData.search,
          //   })
          // );
        }}
        onChange={({ target }) => {
          const getData = JSON.parse(
            localStorage.getItem("searchData") || "{}"
          );
          localStorage.setItem(
            "searchData",
            JSON.stringify({ ...getData, search: target.value })
          );
          setSearch({ ...serach, search: target.value });
        }}
      />
    </div>
  );
}
