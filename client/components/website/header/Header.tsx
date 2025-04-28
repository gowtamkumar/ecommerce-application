"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SearchSection from "./SearchSection";
import HeaderLogo from "./Logo";
import { Avatar } from "antd";
import HeaderRight from "./HeaderRight";

const TopBar = dynamic(() => import("./TopBar"));
const MainMenu = dynamic(() => import("./Menu"));
const MobileMenu = dynamic(() => import("./MobileMenu"));

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  // const setting = await getSettings();

  // useEffect(() => {
  //   (async () => {
  //     const setting = await getSettings();
  //     // localStorage.setItem("header", JSON.stringify(headerData.data));
  //     setSetting(setting.data);
  //   })();
  // }, []);

  useEffect(() => {
    const updateBackground = () => {
      if (window?.innerWidth < 840) {
        setMobile(true);
      } else {
        setMobile(false);
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
      {!mobile && (
        <div>
          <TopBar />
        </div>
      )}

      <header
        className={`${
          isScrolled ? "fixed z-50 top-0 left-0" : ""
        }  w-full bg-white  transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "mt-0"
        }`}
      >
        <SearchSection />
        {!mobile && (
          <div className="border-b-2 ">
            <div className="container mx-auto items-center py-4">
              <div className="flex justify-between items-center">
                <MainMenu />
              </div>
            </div>
          </div>
        )}
      </header>
      {mobile && (
        <div className="fixed z-50 bottom-0 left-0 bg-white w-full">
          <div className="container mx-auto items-center py-4">
            <div className="flex justify-between items-center">
              <MobileMenu />
              <HeaderRight />
              <Avatar
                className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
                size={25}
                src={"/pos_software.png"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
