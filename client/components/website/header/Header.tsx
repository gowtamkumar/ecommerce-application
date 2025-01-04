import React from "react";
import { getSettings } from "@/lib/apis/setting";
import dynamic from "next/dynamic";

const Logo = dynamic(() => import("./Logo"));
const TopBar = dynamic(() => import("./TopBar"));
const MainMenu = dynamic(() => import("./Menu"));
const MobileMenu = dynamic(() => import("./MobileMenu"));
const HeaderRight = dynamic(() => import("./HeaderRight"));

export default async function Header() {
  const setting = await getSettings();

  return (
    <>
      <TopBar />
      <div className="border-b-2">
        <div className="container mx-auto items-center py-4">
          <div className="flex justify-between items-center">
            <Logo settingData={setting} />
            <div className="md:hidden">
              <MobileMenu />
            </div>
            <div className="hidden md:inline md:order-2">
              <MainMenu />
            </div>
            <HeaderRight />
          </div>
        </div>
      </div>
    </>
  );
}
