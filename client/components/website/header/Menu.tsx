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
            className="block px-3 py-2 text-global-text hover:!text-global-button-primary hover:bg-global-button-primary/10 rounded-lg transition-colors font-medium"
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
        overlayClassName="pt-2 profile-dropdown-overlay"
      >
        <Button
          type="primary"
          className="!bg-gradient-to-r !from-global-hover !to-global-hover
                             hover:!from-global-primary hover:!to-global-hover
                             !border-none !h-11 !px-6 !rounded-full !font-semibold !text-sm 
                             flex items-center gap-2 !shadow-lg hover:!shadow-xl
                             !transition-all !duration-300 hover:!scale-105 group"
        >
          <CiMenuFries className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold tracking-wide text-sm font-global-primary-fontfamily">
            Categories
          </span>
          <HiChevronDown className="text-sm group-hover:translate-y-0.5 transition-transform duration-300" />
        </Button>
      </Dropdown>
    </div>
  );
};

export default MainMenu;
