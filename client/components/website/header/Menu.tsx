"use client";

import { Dropdown, Space } from "antd";
import Link from "next/link";

import { CiMenuFries } from "react-icons/ci";
import { useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";

const MainMenu = () => {
  // const pathname = usePathname(); // Get current route
  const global = useSelector(selectGlobal);

  const newData = global.categories?.map((item: any) => {
    return {
      ...item,
      key: item.key.toString(),
      label: (
        <Link
          href={`/products?categoryId=${item.key}`}
          rel="noopener noreferrer"
        >
          {item.label}
        </Link>
      ),
    };
  });

  return (
    <div className="flex items-center">
      <Dropdown
        menu={{
          items: newData,
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
