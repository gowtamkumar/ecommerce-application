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
  }, [global.categories]);

  const AccordionItem = ({ item, onClose }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="border-b border-gray-100 last:border-none">
        <div className="flex justify-between items-center py-4 px-4 hover:bg-gray-50 transition-colors">
          <Link
            href={`/products?categoryId=${item.key}`}
            onClick={onClose}
            className="text-gray-800 font-medium text-base flex-1"
          >
            {item.label}
          </Link>
          {item.children?.length > 0 && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-black transition-colors"
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
        {isOpen && item?.children && (
          <div className="bg-gray-50 px-4 py-2 space-y-2">
            {item.children.map((child: any) => (
              <AccordionItem key={child.id} item={child} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-center px-2">
      <IoMdMenu
        size={32}
        className="text-black cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setOpen(true)}
      />
      <Drawer
        title={<span className="font-bold text-xl">Menu</span>}
        open={open}
        placement="left"
        closable={true}
        width="85%"
        onClose={() => setOpen(false)}
        styles={{ header: { borderBottom: '1px solid #f3f4f6' }, body: { padding: 0 } }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
             {(menu || []).map((item: any) => (
              <AccordionItem key={item?.id} item={item} onClose={() => setOpen(false)} />
            ))}
          </div>
          
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/login" onClick={() => setOpen(false)}>
                <button className="w-full py-3 px-4 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-white hover:shadow-sm transition-all">
                  Login
                </button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <button className="w-full py-3 px-4 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-all shadow-md">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
