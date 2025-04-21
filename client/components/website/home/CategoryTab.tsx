"use client";
import { getPublicCategories } from "@/lib/apis/categories";
import { Radio, Tabs } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryProduct from "./CategoryProduct";

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    featchData();
  }, []);

  const featchData = async () => {
    const categoriesres = await getPublicCategories();
    setCategories(categoriesres.data);
  };

  return (
    <section className="mb-8">
      <Tabs
        defaultActiveKey="1"
        tabPosition="top"
        style={{ height: 220 }}
        onChange={(v) => {
          console.log("ee", v);
        }}
        items={categories.map((item: any) => {
          return {
            label: item.name,
            key: item.id,
            children: <CategoryProduct id={item.id} />,
          };
        })}
      />
    </section>
  );
};

export default CategoryTab;
