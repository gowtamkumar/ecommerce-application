"use client";

import { Menu, Dropdown, Space, MenuProps } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { getAntdCategories } from "@/lib/apis/categories";
import { DownOutlined } from "@ant-design/icons";
import { CiMenuFries } from "react-icons/ci";

const renderMenuItems = (items: any[]) => {
  return (items || []).map((item) => {
    const result = item.class?.split(" ");
    const reNumber = result && result[0];
    const resHeading = result && result[1];
    if (item.children) {
      if (item.class === "megaMenu" && item.children?.length > 0) {
        return {
          key: item.id, // Use link as key to match pathname
          label: (
            <Dropdown
              className="relative flex justify-between"
              trigger={["hover"]}
              // overlayStyle={{
              //   boxShadow: "none",
              //   border: "none",
              //   margin: "0px",
              //   padding: "0px",
              //   fontSize: "unset",
              //   fontFamily: "unset",
              // }}
              dropdownRender={() => (
                <div
                  className={`absolute left-full top-0 bg-white border p-4 grid grid-cols-${item.children.length} gap-10 shadow-lg min-w-[60vw] max-w-[80vw] z-50`}
                >
                  {item.children.map((col: any) => (
                    <div key={col.key}>
                      <h4 className="font-bold text-yellow-500 ml-3">
                        {col.label}
                      </h4>
                      <Menu
                        items={renderMenuItems(col.child || [])}
                        style={{
                          boxShadow: "none",
                          border: "none",
                          margin: "0px",
                          padding: "0px",
                          fontSize: "unset",
                          fontFamily: "unset",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            >
              <Link
                href={`/products?categoryId=${item.id}`}
                className="flex items-center"
              >
                {item.label}{" "}
                {item.children?.length > 0 && <FaAngleRight className="ml-5" />}
              </Link>
            </Dropdown>
          ),
        };
      } else if (Number(reNumber) && !resHeading) {
        const numberclass = +reNumber;

        let gridColsClass = ""; // Initialize an empty string for the grid-cols class

        // Conditionally apply grid-cols based on item.class value
        if (numberclass === 1) {
          gridColsClass = "grid-cols-1"; // 1 column
        } else if (numberclass === 2) {
          gridColsClass = "grid-cols-2"; // 2 columns
        } else if (numberclass === 3) {
          gridColsClass = "grid-cols-3"; // 3 columns
        } else if (numberclass === 4) {
          gridColsClass = "grid-cols-4"; // 4 columns
        } else if (numberclass === 5) {
          gridColsClass = "grid-cols-5"; // 5 columns
        } else if (numberclass === 6) {
          gridColsClass = "grid-cols-6";
        } else if (numberclass === 7) {
          gridColsClass = "grid-cols-7";
        } else {
          gridColsClass = "grid-cols-5";
        }

        return {
          key: item.id,
          label: (
            <Dropdown
              className="flex"
              dropdownRender={() => (
                <div
                  className={`shadow-lg bg-white rounded-md p-2 border gap-x-2 gap-y-1 text-gray-700 grid ${gridColsClass} `}
                >
                  {item.children.map((col: any) => {
                    return (
                      <div key={col.key}>
                        {resHeading ? (
                          <h4 className="font-bold text-yellow-500 ml-3">
                            {col.label}
                          </h4>
                        ) : (
                          // <h5 className="font-bold text-gray-700 hover:bg-[#f0f0f0] px-2 py-1 rounded-md">
                          <Link
                            href={`/products?categoryId=${col.id}`}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-700  hover:bg-[#f0f0f0] px-2 py-1 rounded-md"
                          >
                            {col.label}
                          </Link>
                          // </h5>
                        )}

                        <Menu
                          items={renderMenuItems(col.child || [])}
                          style={{
                            boxShadow: "none",
                            border: "none",
                            margin: "0px",
                            padding: "0px",
                            fontSize: "unset",
                            fontFamily: "unset",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              trigger={["hover"]}
              overlayStyle={{
                // boxShadow: "none",
                // border: "none",
                // margin: "0px",
                // padding: "0px",
                fontSize: "unset",
                fontFamily: "unset",
              }}
            >
              <Link
                href={`/products?categoryId=${item.id}`}
                className="flex items-center"
              >
                {item.name}{" "}
                {item.children?.length > 0 && <FaAngleDown className="ml-1" />}
              </Link>
            </Dropdown>
          ),
        };
      } else if (Number(reNumber) && resHeading) {
        const numberclass = +reNumber;

        let gridColsClass = ""; // Initialize an empty string for the grid-cols class

        // Conditionally apply grid-cols based on item.class value
        if (numberclass === 1) {
          gridColsClass = "grid-cols-1"; // 1 column
        } else if (numberclass === 2) {
          gridColsClass = "grid-cols-2"; // 2 columns
        } else if (numberclass === 3) {
          gridColsClass = "grid-cols-3"; // 3 columns
        } else if (numberclass === 4) {
          gridColsClass = "grid-cols-4"; // 4 columns
        } else if (numberclass === 5) {
          gridColsClass = "grid-cols-5"; // 5 columns
        } else if (numberclass === 6) {
          gridColsClass = "grid-cols-6";
        } else if (numberclass === 7) {
          gridColsClass = "grid-cols-7";
        } else {
          gridColsClass = "grid-cols-5";
        }

        return {
          key: item.id,
          label: (
            <Dropdown
              className="flex"
              overlayStyle={{
                // boxShadow: "none",
                // border: "none",
                // margin: "0px",
                // padding: "0px",
                fontSize: "unset",
                fontFamily: "unset",
              }}
              dropdownRender={() => (
                <div
                  className={`shadow-lg bg-white rounded-md p-2 border  gap-y-1 font-bold text-gray-700 grid ${gridColsClass}`}
                >
                  {item.children.map((col: any) => {
                    return (
                      <div key={col.key}>
                        {resHeading && (
                          <h4 className="font-bold text-yellow-500 ml-3">
                            {col.name}
                          </h4>
                        )}

                        <Menu
                          items={renderMenuItems(col.child || [])}
                          className="text-5xl"
                          style={{
                            boxShadow: "none",
                            border: "none",
                            margin: "0px",
                            padding: "0px",
                            fontSize: "unset",
                            fontFamily: "unset",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              trigger={["hover"]}
            >
              <Link
                href={`/products?categoryId=${item.id}`}
                className="flex items-center"
              >
                {item.name}{" "}
                {item.children?.length > 0 && <FaAngleDown className="ml-1" />}
              </Link>
            </Dropdown>
          ),
        };
      } else {
        return {
          key: item.id,
          label: (
            <Dropdown
              overlayStyle={{
                fontSize: "unset",
                fontFamily: "unset",
              }}
              dropdownRender={() => (
                <Menu
                  items={renderMenuItems(item.children)}
                  className="border bg-slate-800"
                  style={{
                    boxShadow: "none",
                    border: "none",
                    margin: "0px",
                    padding: "0px",
                    fontSize: "unset",
                    fontFamily: "unset",
                  }}
                />
              )}
              trigger={["hover"]}
            >
              <Link
                href={`/products?categoryId=${item.id}`}
                className="flex items-center"
              >
                {item.name} {/* main headding */}
                {item.children?.length > 0 && <FaAngleDown className="ml-1" />}
              </Link>
            </Dropdown>
          ),
        };
      }
    }
    return {
      key: item.id, // Use link as key
      label: <Link href={item.id || "#"}>{item.name}</Link>,
    };
  });
};

const MainMenu = () => {
  const [categories, setCategories] = useState([]);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    (async () => {
      const response = await getAntdCategories();
      console.log("categories", response);

      const newData = response.data.map((item: any) => {
        return {
          ...item,
          key: item.key.toString(),
          label: (
            <Link
              href={`/products?categoryId=${item.key}`}
              // target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </Link>
          ),
        };
      });

      console.log("newData", newData);

      setCategories(newData);
    })();
  }, []);


  return (
    <div className="flex items-center">
      <Dropdown
        menu={{
          items: categories,
        }}
        trigger={["click"]}
      >
        <Space className="cursor-pointer">
          <CiMenuFries />
          Categories
        </Space>
      </Dropdown>

      {/* <Menu
        mode="horizontal"
        selectedKeys={[pathname]} // Highlight current menu item
        className="bg-white p-2"
        style={{
          boxShadow: "none",
          border: "none",
          margin: "0px",
          padding: "0px",
          fontSize: "unset",
          fontFamily: "unset",
        }}
      >
        {renderMenuItems(categories).map((item, idx: number) => {
          return (
            <Menu.Item key={item.key === "#" ? item.key + idx : item.key}>
              {item.label}
            </Menu.Item>
          );
        })}
      </Menu> */}
    </div>
  );
};

export default MainMenu;
