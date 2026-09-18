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
          ? "fixed top-0 left-0 bg-global-header-bg/95 backdrop-blur-lg shadow-lg"
          : "relative bg-global-header-bg border-b border-gray-200 border-global-secondary/5"
          } w-full transition-all duration-500 ease-in-out z-40 text-global-header-text`}
      >
        {!global.mobile ? (
          <div
            className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"
              }`}
          >
            <div className="flex items-center justify-between gap-4 lg:gap-6">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Categories Menu */}
              <div className="hidden lg:block">
                <MainMenu />
              </div>

              {/* Search Bar - Desktop */}
              <div className="flex-1 max-w-xl hidden xl:block">
                <SearchEngine />
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2 sm:gap-3">
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
                    type="default"
                    className="!h-10 !px-4 !rounded-full !font-medium !text-sm flex items-center gap-2 !border-gray-200 !bg-white !text-gray-800 hover:!border-global-primary hover:!text-global-primary !shadow-none !transition-colors duration-200 group"
                  >
                    <HiSparkles className="w-4 h-4 text-global-primary" />
                    <span>Offers</span>
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
        <div className="fixed z-[60] bottom-0 left-0 bg-global-header-bg/98 backdrop-blur-lg w-full shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-global-secondary/5 pb-safe text-global-header-text">
          <div className="container mx-auto py-3">
            <MobileMenu />
          </div>
        </div>
      )}
    </div>
  );
}
