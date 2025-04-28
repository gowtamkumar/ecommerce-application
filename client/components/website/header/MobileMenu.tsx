"use client";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";

export default function MobileMenu() {
  const [menu, setMenu] = useState([]);
  const [open, setOpen] = useState(false);

  const global = useSelector(selectGlobal);

  useEffect(() => {
    setMenu(global.categories);
  }, []);

  const AccordionItem = ({ item, onClose }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b">
        <button className="w-full flex justify-between items-center py-3 hover:bg-gray-200 text-left px-2 ">
          <Link
            href={`/products?categoryId=${item.key}`}
            onClick={onClose}
            className="text-gray-500 w-full"
            rel="noopener noreferrer"
          >
            {item.label}
          </Link>
          {item.children?.length > 0 && (
            <svg
              onClick={() => setIsOpen(!isOpen)}
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
        {isOpen && item?.children && (
          <div className="ml-4">
            {item.children.map((child: any) => (
              <AccordionItem key={child.id} item={child} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main Accordion component
  const Accordion = ({ data, onClose }: any) => {
    return (
      <div className="w-full max-w-md mx-auto bg-white overflow-hidden">
        {(data || []).map((item: any) => (
          <AccordionItem key={item?.id} item={item} onClose={onClose} />
        ))}
      </div>
    );
  };

  return (
    <div className="text-center px-2">
      <IoMdMenu
        size={36}
        className="font-medium cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <Drawer
        title={null}
        open={open}
        placement="left"
        closable={true}
        width={900}
        onClose={() => setOpen(false)}
        footer={
          <div className="flex gap-4 justify-center text-center">
            <button
              className="btn-primary-bioxin"
              onClick={() => setOpen(false)}
            >
              <Link href={"/login"} className="text-white">
                Login
              </Link>
            </button>
            <button
              className="btn-primary-bioxin"
              onClick={() => setOpen(false)}
            >
              <Link href={"/signup"} className="text-white">
                Register
              </Link>
            </button>
          </div>
        }
      >
        <Accordion data={menu} onClose={() => setOpen(false)} />
      </Drawer>
    </div>
  );
}
