"use client";

import { Dropdown, Space } from "antd";
import Link from "next/link";

import { CiMenuFries } from "react-icons/ci";
import { useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useMemo } from "react";

const MainMenu = () => {
  const global = useSelector(selectGlobal);

  type MenuItem = {
    key: string;
    label: React.ReactNode;
    title: string;
    children: MenuItem[] | null;
  };

  function formatCategory(node: {
    key: string;
    id: number;
    name: string;
    children?: any[];
  }): MenuItem {
    return {
      key: node.id.toString(),
      label: (
        <Link
          href={`/products?categoryId=${node.id}&`}
          rel="noopener noreferrer"
        >
          {node.name}
        </Link>
      ),
      title: node.name,
      children:
        Array.isArray(node.children) && node.children.length > 0
          ? node.children.map(formatCategory)
          : null,
    };
  }

  const optimizeCategory = useMemo(() => {
    return global.categories ? global?.categories?.map(formatCategory) : [];
  }, [global.categories]);

  return (
    <div className="flex items-center">
      <Dropdown
        menu={{
          items: optimizeCategory,
        }}
        trigger={["click"]}
      >
        <Space className="cursor-pointer">
          <CiMenuFries />
          Categories
        </Space>
      </Dropdown>
    </div>
  );
};

export default MainMenu;
