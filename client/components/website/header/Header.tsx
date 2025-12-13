"use client";
import { getCategoriesForMenu } from "@/lib/apis/categories";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setCategories,
  setMobile,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import HeaderRight from "./HeaderRight";
import SearchEngine from "./SearchEngine";

const Logo = dynamic(() => import("./Logo"));
const CurrencySwitcher = dynamic(() => import("./CurrencySwitcher"));
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
    <div className="w-full relative z-50">
      {/* TopBar - Desktop Only */}
      {!global.mobile && (
        <div className="relative">
          <TopBar />
        </div>
      )}

      {/* Main Header */}
      <header
        className={`${isScrolled
          ? "fixed top-0 left-0 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
          : "relative bg-white border-b border-gray-100"
          } w-full transition-all duration-500 ease-in-out z-40`}
      >
        {!global.mobile ? (
          <div
            className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"
              }`}
          >
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Categories Menu */}
              <div className="hidden lg:block">
                <MainMenu />
              </div>

              {/* Search Bar - Desktop */}
              <div className="flex-1 max-w-2xl hidden xl:block">
                <SearchEngine />
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Currency Switcher */}
                <div className="hidden md:block">
                  <CurrencySwitcher />
                </div>

                {/* Search - Tablet */}
                <div className="xl:hidden">
                  <SearchEngine />
                </div>

                {/* Action Icons */}
                <HeaderRight />

                {/* Special Offers Button */}
                <Link href="/offers">
                  <Button
                    type="primary"
                    className="!bg-gradient-to-r !from-global-primary !to-orange-500
                             hover:!from-orange-500 hover:!to-global-primary
                             !border-none !h-11 !px-6 !rounded-full !font-semibold !text-sm 
                             flex items-center gap-2 !shadow-lg hover:!shadow-xl
                             !transition-all !duration-300 hover:!scale-105 group"
                  >
                    <HiSparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Special Offers</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Mobile Header
          <div className="container mx-auto py-3 px-4 flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              <HeaderRight />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
      {global.mobile && (
        <div className="fixed z-[60] bottom-0 left-0 bg-white/98 backdrop-blur-lg w-full 
                      shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-200/50 pb-safe">
          <div className="container mx-auto py-3">
            <MobileMenu />
          </div>
        </div>
      )}
    </div>
  );
}
