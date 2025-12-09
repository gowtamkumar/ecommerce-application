"use client";
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import SearchSection from "./SearchSection"; // Removed
import HeaderRight from "./HeaderRight";
import SearchEngine from "./SearchEngine";
const Logo = dynamic(() => import("./Logo"));
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setCategories,
  setMobile,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { getCategoriesForMenu } from "@/lib/apis/categories";
import Link from "next/link";
import { Button } from "antd";
import { getSettings } from "@/lib/apis/setting";

const TopBar = dynamic(() => import("./TopBar"));
const MainMenu = dynamic(() => import("./Menu"));
const MobileMenu = dynamic(() => import("./MobileMenu"));

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchCategory = useCallback(async () => {
    const setting = await getSettings();
    dispatch(setSetting(setting?.data));
    const response = await getCategoriesForMenu();
    dispatch(setCategories(response.data));
  }, [dispatch]);

  useEffect(() => {
    fetchCategory();
    const updateBackground = () => {
      if (window?.innerWidth < 840) {
        dispatch(setMobile(true));
      } else {
        dispatch(setMobile(false));
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    updateBackground(); // Set initial state

    window.addEventListener("resize", updateBackground);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", updateBackground);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, fetchCategory]);

  return (
    <div className="w-full relative">
      {!global.mobile && (
        <div className="bg-black text-white text-xs py-1">
           <TopBar />
        </div>
      )}

      <header
        className={`${
          isScrolled ? "fixed z-50 top-0 left-0 shadow-md" : "relative"
        } w-full bg-white transition-all duration-300`}
      >
        {!global.mobile ? (
          <div className="container mx-auto py-3 px-4">
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                 <Logo />
              </div>

              {/* Menu */}
              <div className="hidden lg:block">
                <MainMenu />
              </div>

              {/* Search */}
              <div className="flex-1 max-w-xl">
                <SearchEngine />
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-4">
                <HeaderRight />
                <Link href="/offers">
                  <Button type="primary" className="bg-black hover:!bg-gray-800 border-none">
                    Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto py-3 px-4 flex justify-between items-center">
             <Logo />
             <HeaderRight />
          </div>
        )}
      </header>

      {global.mobile && (
        <div className="fixed z-50 bottom-0 left-0 bg-white w-full shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto py-3">
             <MobileMenu />
          </div>
        </div>
      )}
    </div>
  );
}
