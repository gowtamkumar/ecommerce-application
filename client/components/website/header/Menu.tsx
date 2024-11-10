"use client";
import { Badge, Col, Dropdown, Menu, MenuProps, Row, Space } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { getMenus } from "@/lib/apis/menu";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";


const menuData = [
  {
    label: "Home",
    key: "home",
    url: "/",
  },

  {
    label: "Watch",
    key: "Watch",
    megaMenu: true,
    children: [
      {
        label: "Watch type",
        key: "Watchtype",
      },
      {
        label: "head type",
        key: "headtype",
      },
      {
        label: "mouse type",
        key: "mouse1type",
      },
      {
        label: "keyboard type",
        key: "keyboa1rdtype",
      },
      {
        label: "keyboard",
        key: "keyboardtype1",
      },
      {
        label: "motherboard type",
        key: "keyboardtype2",
        children: [
          { label: "keyboardtype1", key: "keyboardtype12" },
          { label: "keyboardtype2", key: "keyboardtype23" },
          { label: "keyboardtype3", key: "keyboardtype35" },
        ],
      },
    ],
  },
  {
    label: "Electronics",
    key: "electronics",
    children: [
      {
        label: "Mobile Phones",
        key: "mobiles",
        megaMenu: true,
        children: [
          {
            label: "Ear type",
            key: "Eartype",
            children: [
              { label: "ear", key: "ear" },
              { label: "ear1", key: "ear1" },
              { label: "ear2", key: "ear3" },
            ],
          },
          {
            label: "head type",
            key: "headtype",
            children: [
              { label: "head", key: "head" },
              { label: "head1", key: "head1" },
              { label: "head2", key: "head2" },
            ],
          },
          {
            label: "mouse type",
            key: "mousetype",
            children: [
              { label: "mouse", key: "mouse" },
              { label: "mouse1", key: "mouse1" },
              { label: "mouse2", key: "mouse2" },
            ],
          },
          {
            label: "keyboard type",
            key: "keyboardtype",
            children: [
              { label: "keyboardtype1", key: "keyboardtype1" },
              { label: "keyboardtype2", key: "keyboardtype2" },
              { label: "keyboardtype3", key: "keyboardtype3" },
            ],
          },
          {
            label: "keyboard type",
            key: "keyboardtype1",
            children: [
              { label: "keyboardtype1", key: "keyboardtype12" },
              { label: "keyboardtype2", key: "keyboardtype23" },
              { label: "keyboardtype3", key: "keyboardtype34" },
            ],
          },
          {
            label: "keyboard type",
            key: "keyboardtype2",
            children: [
              { label: "keyboardtype1", key: "keyboardtype12" },
              { label: "keyboardtype2", key: "keyboardtype23" },
              { label: "keyboardtype3", key: "keyboardtype35" },
            ],
          },
        ],
      },
      {
        label: "Laptops",
        key: "laptops",
        megaMenu: true,
        children: [
          {
            label: "Game type",
            key: "Gametype",
            children: [
              { label: "Game", key: "Game" },
              { label: "Game1", key: "Game1" },
              { label: "Game2", key: "Game3" },
            ],
          },
          { label: "Ultrabooks", key: "ultrabooks", children: [] },
          { label: "Ultrabooks", key: "ultrabookss", children: [] },
        ],
      },
    ],
  },
  {
    label: "Clothing",
    key: "clothing",
    children: [
      { label: "Men's Clothing", key: "mens-clothing" },
      { label: "Women's Clothing", key: "womens-clothing" },
      { label: "Women's Clothing", key: "womens-cslothing" },
    ],
  },
];

export default function MainMenu() {
  const [hoveredKey, setHoveredKey] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     const menus = await getMenus();

  //     const convertToMenuItems = (menuItems: any) => {
  //       return menuItems.map((item: any) => ({
  //         key: item.id, // Each item should have a unique key
  //         label: (
  //           <a href={item.link} target="_blank" rel="noopener noreferrer">
  //             {item.label}
  //           </a>
  //         ),
  //         children:
  //           item.child && item.child.length > 0
  //             ? convertToMenuItems(item.child)
  //             : null,
  //       }));
  //     };

  //     const items = convertToMenuItems(menus.data);

  //     setMenus(items);
  //   })();
  // }, []);

  const MegaMenu = ({ menuData }: any) => {
    return (
      <nav className="bg-white py-4 text-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Top-level Navigation Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {menuData.map((menuItem: any) => (
              <MenuItem
                key={menuItem.key}
                item={menuItem}
                hoveredKey={hoveredKey}
                setHoveredKey={setHoveredKey}
              />
            ))}
          </div>
        </div>
      </nav>
    );
  };

  const MenuItem = ({ item, hoveredKey, setHoveredKey }: any) => {
    return (
      <div
        className="relative group"
        onMouseEnter={() => setHoveredKey({ root: item.key })}
        onMouseLeave={() => setHoveredKey(null)}
      >
        {/* Top-level Link */}
        <a
          href={item.url || "#"}
          className="hover:text-bioxin-primary flex items-center"
        >
          <div className="flex items-center gap-1 font-semibold">
            {item.label} {item.children && <MdKeyboardArrowDown />}
          </div>
        </a>

        {/* Dropdown Menu */}
        {item.children && !item.megaMenu && (
          <div
            className={`absolute top-full bg-white shadow-md rounded-sm z-10 w-48 ${
              hoveredKey?.root === item.key ? "block" : "hidden"
            }`}
          >
            {item.children.map((subItem: any) => (
              <SubMenu
                key={subItem.key}
                item={subItem}
                hoveredKey={hoveredKey}
                setHoveredKey={setHoveredKey}
              />
            ))}
          </div>
        )}
        {item.children && item.megaMenu && (
          <div
            className={`absolute top-15 bg-white shadow-md rounded-sm w-[90vh] p-4 z-10 ${
              hoveredKey?.root === item.key ? "block" : "hidden"
            }`}
          >
            <div className="grid grid-cols-5">
              {item.children.map((nestedItem: any) => (
                <div key={nestedItem.key}>
                  <Link href="/about">
                    <h3 className="mb-2">{nestedItem.label}</h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const SubMenu = ({ item, hoveredKey, setHoveredKey }: any) => (
    <div
      className="relative group"
      onMouseEnter={() => setHoveredKey({ ...hoveredKey, mega: item.key })}
      onMouseLeave={() => setHoveredKey(null)}
    >
      {/* Dropdown Item */}
      <a href="#" className="block px-4 py-2 hover:text-bioxin-primary">
        <div className="flex items-center gap-1">
          {item.label} {item.children && <MdKeyboardArrowRight />}
        </div>
      </a>

      {/* Mega Menu for Specific Items */}
      {item.megaMenu && item.children && (
        <div
          className={`absolute left-full top-5 bg-white shadow-md rounded-sm  w-[90vh] p-4 z-10 ${
            hoveredKey?.mega === item.key ? "block" : "hidden"
          }`}
        >
          <div className="grid grid-cols-5 gap-4">
            {item.children.map((nestedItem: any) => (
              <div key={nestedItem.key}>
                <h3 className="font-semibold text-lg mb-2">
                  {nestedItem.label}
                </h3>
                <ul className="space-y-1">
                  {nestedItem.children.map((deepNestedItem: any) => (
                    <li key={deepNestedItem.key}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-bioxin-primary"
                      >
                        {deepNestedItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <MegaMenu menuData={menuData} />
      <div className="hidden md:block">
        <Link href="/profile" className="cursor-pointer md:hidden inline ">
          <Badge size="default">
            <CiHeart className="font-medium lg:text-lg text-2xl" />
          </Badge>
        </Link>

        <Link href="/checkout" className="mt-1 md:hidden inline">
          <Badge size="default" count={30}>
            <IoBagOutline className="font-medium lg:text-lg text-2xl" />
          </Badge>
        </Link>
      </div>
    </>
  );
}
