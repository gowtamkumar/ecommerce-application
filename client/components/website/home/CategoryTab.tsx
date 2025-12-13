"use client";
import { getPublicCategories } from "@/lib/apis/categories";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      featchData();
    }
  }, [initialCategories]);

  const featchData = async () => {
    const categoriesres = await getPublicCategories();
    setCategories(categoriesres.data);
    if (categoriesres.data.length > 0) {
      setActiveKey(categoriesres.data[0].id.toString()); // Set first tab as active
    }
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      tabPosition="top"
      items={categories.map((item: any) => ({
        label: item.name,
        key: item.id.toString(),
        children: <CategoryProduct id={item.id.toString()} />,
      }))}
    />
  );
};

export default CategoryTab;
