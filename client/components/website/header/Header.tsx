"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
// import SearchSection from "./SearchSection"; // Removed
import { getCategoriesForMenu } from "@/lib/apis/categories";
import { getSettings } from "@/lib/apis/setting";
import {
  selectGlobal,
  setCategories,
  setMobile,
  setSetting,
} from "@/redux/features/global/globalSlice";
import { Button } from "antd";
import Link from "next/link";
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
      {!global.mobile && (
        <div className="bg-black text-white text-xs py-2 font-global-secondary-fontfamily tracking-wide">
          <TopBar />
        </div>
      )}

      <header
        className={`${isScrolled
          ? "fixed top-0 left-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50"
          : "relative bg-white border-b border-gray-100"
          } w-full transition-all duration-300 z-40 transition-all ease-in-out`}
      >
        {!global.mobile ? (
          <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? "py-3" : "py-5"}`}>
            <div className="flex items-center justify-between gap-12">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Menu */}
              <div className="hidden lg:block">
                <MainMenu />
              </div>

              {/* Search */}
              <div className="flex-1 max-w-lg hidden xl:block">
                <SearchEngine />
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-6">
                <div className="hidden md:block">
                  <CurrencySwitcher />
                </div>
                <div className="xl:hidden">
                  <SearchEngine />
                </div>
                <HeaderRight />
                <Link href="/offers">
                  <Button
                    type="primary"
                    className="!bg-black hover:!bg-gray-800 border-none !h-10 !px-6 !rounded-lg !font-medium !text-sm flex items-center gap-2 shadow-lg shadow-gray-200"
                  >
                    Special Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto py-3 px-4 flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              <HeaderRight />
            </div>
          </div>
        )}
      </header>

      {global.mobile && (
        <div className="fixed z-[60] bottom-0 left-0 bg-white/95 backdrop-blur-md w-full shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 pb-safe">
          <div className="container mx-auto py-2">
            <MobileMenu />
          </div>
        </div>
      )}
    </div>
  );
}
