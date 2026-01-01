"use client";

import { Dropdown } from "antd";
import Link from "next/link";

import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useCallback, useMemo } from "react";
import { CiMenuFries } from "react-icons/ci";
import { HiChevronDown } from "react-icons/hi";
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
            className="block px-3 py-2 text-global-primary hover:bg-global-primary/10 rounded-lg transition-colors font-medium"
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
          className: "min-w-[220px] p-2 rounded-xl shadow-2xl border border-gray-100/50 bg-white backdrop-blur-md"
        }}
        trigger={["click"]}
        overlayClassName="pt-2"
      >
        <div className="cursor-pointer flex items-center gap-2.5 px-6 py-2.5 
                      bg-global-primary hover:bg-global-hover
                      text-white rounded-full transition-all duration-300 
                      shadow-lg hover:shadow-xl 
                      hover:scale-105 group
                      border border-white/10">
          <CiMenuFries className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold tracking-wide text-sm font-global-primary-fontfamily">
            Categories
          </span>
          <HiChevronDown className="text-sm group-hover:translate-y-0.5 transition-transform duration-300" />
        </div>
      </Dropdown>
    </div>
  );
};

export default MainMenu;
