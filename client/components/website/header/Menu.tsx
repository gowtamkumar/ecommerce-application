"use client";

import { Button, Dropdown } from "antd";
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
            className="block px-3 py-2 text-global-text hover:text-global-button-primary hover:bg-global-button-primary/10 rounded-lg transition-colors font-medium"
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
        }}
        trigger={["click"]}
        classNames={{ root: "pt-2 profile-dropdown-overlay" }}
      >
        <Button
          type="default"
          className="h-10 px-4 rounded-full font-medium text-sm
                     border-gray-200 bg-white text-gray-800
                     hover:border-global-primary hover:text-global-primary
                     shadow-none flex items-center gap-2 transition-colors duration-200 group"
        >
          <CiMenuFries className="text-base" />
          <span className="tracking-wide text-sm">Categories</span>
          <HiChevronDown className="text-sm text-gray-400 group-hover:text-global-primary transition-colors" />
        </Button>
      </Dropdown>
    </div>
  );
};

export default MainMenu;
