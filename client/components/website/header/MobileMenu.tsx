"use client";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { HiChevronRight, HiX } from "react-icons/hi";
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
            className="text-global-text font-bold text-base flex-1 hover:text-global-primary transition-colors"
          >
            {item.label}
          </Link>
          {item.children?.length > 0 && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-global-text/40 hover:text-global-primary transition-colors rounded-full hover:bg-global-text/5"
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
          <div className="bg-gray-50 px-4 py-2 space-y-1 animate-slideDown">
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
      {/* Menu Button */}
      <div 
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-global-header-text/5 rounded-lg transition-all duration-300 cursor-pointer group"
      >
        <IoMdMenu
          size={28}
          className="text-global-header-text/80 group-hover:text-global-primary transition-colors"
        />
      </div>
      
      {/* Drawer */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-2xl bg-gradient-to-r from-global-primary to-global-primary/60 bg-clip-text text-transparent uppercase tracking-tight">
              Menu
            </span>
            <button 
              onClick={() => setOpen(false)}
              className="p-2 hover:bg-global-header-text/5 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5 text-global-header-text/60" />
            </button>
          </div>
        }
        open={open}
        placement="left"
        closable={false}
        size="85%"
        onClose={() => setOpen(false)}
        styles={{ 
          header: { borderBottom: '1px solid #f3f4f6', padding: '16px 20px' }, 
          body: { padding: 0 } 
        }}
        className="mobile-menu-drawer"
      >
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            {(menu || []).map((item: any) => (
              <AccordionItem key={item?.id} item={item} onClose={() => setOpen(false)} />
            ))}
          </div>
          
          {/* Bottom Action Buttons */}
          <div className="p-6 border-t border-global-header-text/5 bg-gradient-to-br from-global-bg to-global-bg/50">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/login" onClick={() => setOpen(false)}>
                <button className="w-full py-3.5 px-4 rounded-xl border border-global-header-text/10 
                                 font-bold text-global-text/80 hover:bg-global-bg hover:shadow-xl 
                                 hover:border-global-primary/30 hover:text-global-primary
                                 transition-all duration-300 group">
                  <span className="flex items-center justify-center gap-2">
                    Login
                    <HiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <button className="w-full py-3.5 px-4 rounded-xl 
                                 bg-global-button-primary
                                 text-global-button-text font-bold 
                                 hover:bg-global-button-hover
                                 transition-all duration-300 shadow-lg hover:shadow-xl 
                                 hover:scale-105">
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
