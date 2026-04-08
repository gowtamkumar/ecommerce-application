"use client";
import { Tabs } from "antd";
import { useState } from "react";
import CategoryProduct from "./CategoryProduct";

interface CategoryTabProps {
  categories?: any[];
}

const CategoryTab = ({ categories: initialCategories }: CategoryTabProps) => {

  const [categories, setCategories] = useState<any[]>(initialCategories || []);

  const [activeKey, setActiveKey] = useState<string | undefined>(
    initialCategories && initialCategories.length > 0
      ? initialCategories[0].id.toString()
      : undefined
  );



  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabPlacement="top"
      items={categories.map((item: any) => ({
        label: item.name,
        key: item.id.toString(),
        children: <CategoryProduct id={item.id.toString()} />,
      }))}
    />
  );
};

export default CategoryTab;
