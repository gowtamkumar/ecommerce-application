"use client";
import React, { useEffect, useState } from "react";
import { getSettings } from "@/lib/apis/setting";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("./Logo"));
const TopBar = dynamic(() => import("./TopBar"));
const MainMenu = dynamic(() => import("./Menu"));
const MobileMenu = dynamic(() => import("./MobileMenu"));
const HeaderRight = dynamic(() => import("./HeaderRight"));

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [setting, setSetting] = useState([]); // Track when page is loaded
  const [mobile, setMobile] = useState(false);
  // const setting = await getSettings();

  useEffect(() => {
    (async () => {
      const setting = await getSettings();
      // localStorage.setItem("header", JSON.stringify(headerData.data));
      setSetting(setting.data);
    })();
  }, []);

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
      <div>
        <TopBar />
      </div>
      {/* Sticky Header */}
      {/* <header
        className={`${
          isScrolled ? "fixed z-10 top-0 left-0" : ""
        }  w-full bg-white  transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "mt-0"
        }`}
      >
        <div className="container mx-auto items-center py-4">
          <div className="flex justify-between align-middle items-center w-full">
            <div className="md:hidden">{mobile && <MobileMenu />}</div>

            <div className="md:hidden lg:hidden xl:hidden">
              <div className="flex justify-center">
                <Link href={"/"}>
                  {header?.header_logo ? (
                    <Image
                      src={header.header_logo}
                      alt="bio-xin-logo"
                      width={93}
                      height={55}
                      priority
                    />
                  ) : (
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={93}
                      height={55}
                      priority
                    />
                  )}
                </Link>
              </div>
            </div>

            <div className="hidden md:inline md:order-2 w-full">
              <MainMenu />
            </div>

            <div className="flex md:gap-4 gap-1 justify-between items-center order-3">
              <HeaderRight />
            </div>
          </div>
        </div>
      </header> */}
      <header
        className={`${
          isScrolled ? "fixed z-10 top-0 left-0" : ""
        }  w-full bg-white  transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "mt-0"
        }`}
      >
        <div className="border-b-2">
          <div className="container mx-auto items-center py-4">
            <div className="flex justify-between items-center">
              <Logo settingData={setting} />
              <div className="md:hidden">{mobile && <MobileMenu />}</div>
              <div className="hidden md:inline md:order-2">
                <MainMenu />
              </div>
              <HeaderRight />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
