"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SearchSection from "./SearchSection";
import HeaderRight from "./HeaderRight";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setCategories, setMobile } from "@/redux/features/global/globalSlice";
import { getAntdCategories } from "@/lib/apis/categories";

const TopBar = dynamic(() => import("./TopBar"));
const MainMenu = dynamic(() => import("./Menu"));
const MobileMenu = dynamic(() => import("./MobileMenu"));

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const fetchCategory = async () => {
    const response = await getAntdCategories();
    dispatch(setCategories(response.data));
  };

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
  }, []);

  return (
    <div className="w-full">
      {!global.mobile && (
        <div>
          <TopBar />
        </div>
      )}

      <header
        className={`${isScrolled ? "fixed z-50 top-0 left-0" : ""
          }  w-full bg-white  transition-transform duration-300 ${isScrolled ? "translate-y-0" : "mt-0"
          }`}
      >
        <div className="bg-gray-100">
          <SearchSection />
        </div>
        {!global.mobile && (
          <div className="border-b-2 ">
            <div className="container mx-auto items-center py-4">
              <div className="flex justify-between items-center">
                <MainMenu />
                <h2>Customer Menu</h2>
              </div>
            </div>
          </div>
        )}
      </header>
      {global.mobile && (
        <div className="fixed z-50 bottom-0 left-0 bg-white w-full">
          <div className="container mx-auto items-center py-4">
            <div className="flex justify-between items-center">
              <MobileMenu />
              <HeaderRight />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
