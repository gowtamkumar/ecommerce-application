"use client";

import { Dropdown } from "antd";
import Link from "next/link";

import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useCallback, useMemo } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSelector } from "react-redux";

const MainMenu = () => {
  const global = useSelector(selectGlobal);

  type MenuItem = {
    key: string;
    label: React.ReactNode;
    title: string;
    children: MenuItem[] | null;
  };

  const formatCategory = useCallback(
    (node: {
      key: string;
      id: number;
      name: string;
      children?: any[];
    }): MenuItem => {
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
    },
    []
  );

  const optimizeCategory = useMemo(() => {
    return global.categories ? global?.categories?.map(formatCategory) : [];
  }, [global.categories, formatCategory]);

  return (
    <div className="flex items-center">
      <Dropdown
        menu={{
          items: optimizeCategory,
          className: "min-w-[200px] p-2 rounded-xl shadow-xl border border-gray-100"
        }}
        trigger={["click"]}
        overlayClassName="pt-2"
      >
        <div className="cursor-pointer flex items-center gap-2.5 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg group">
          <CiMenuFries className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-medium tracking-wide text-sm font-global-primary-fontfamily">Categories</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default MainMenu;
