"use client";
import { useState } from "react";
import { Badge, Drawer } from "antd";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { IoBagHandleOutline } from "react-icons/io5";

const menuData = [
  {
    label: "Home",
    key: "home",
    url: "/",
  },
  {
    label: "Watch Phones",
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
        label: "keyboard s type",
        key: "keyboa1rdtype",
      },
      {
        label: "keyboard sss type",
        key: "keyboardtype1",
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
          { label: "Gaming Laptops", key: "gaming-laptops" },
          { label: "Ultrabooks", key: "ultrabooks" },
          { label: "Ultrabooks", key: "ultrabookss" },
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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  const AccordionItem = ({ item }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center py-3 hover:bg-gray-200 text-left"
        >
          <span>{item.label}</span>
          {item.children && (
            <svg
              className={`w-5 h-5 transform transition-transform duration-100 ${isOpen ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>
        {isOpen && item.children && (
          <div className="ml-4">
            {item.children.map((child: any) => (
              <AccordionItem key={child.key} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main Accordion component
  const Accordion = ({ data }: any) => {
    return (
      <div className="w-full max-w-md mx-auto bg-white  overflow-hidden">
        {data.map((item: any) => (
          <AccordionItem key={item.key} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="text-center px-2">
      <IoMdMenu
        size={22}
        className="font-medium cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Drawer
        title={
          <div className="flex justify-end items-center gap-2 px-3">
            <Link href="/checkout" className="mt-1 md:hidden inline">
              <Badge size="default" count={30}>
                <IoBagHandleOutline className="font-medium lg:text-lg text-2xl" />
              </Badge>
            </Link>
          </div>
        }
        open={open}
        placement="left"
        closable={true}
        width={900}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex gap-4 justify-center text-center">
            <button className="btn-primary-bioxin">
              <Link href={"/login"} className="text-white">
                Login
              </Link>
            </button>
            <button className="btn-primary-bioxin">
              <Link href={"/register"} className="text-white">
                Register
              </Link>
            </button>
          </div>
        }
      >
        <Accordion data={menuData} />
      </Drawer>
    </div>
  );
}
