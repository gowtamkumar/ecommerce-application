import React from "react";
import TopBar from "./TopBar";
import HeaderLogo from "./HeaderLogo";
import HeaderRight from "./HeaderRight";
import HeaderSearch from "./HeaderSearch";
import { getSettings } from "@/lib/apis/setting";

export default async function Header() {
  //  const res = await saveVisitor({})
  //  console.log("🚀 ~ res:", res)
  const logo = await getSettings();
  return (
    <div className="bg-rose-400">
      <div className="lg:w-8/12 mx-auto">
        <TopBar />
        <div className="flex items-center py-4 sticky">
          <HeaderLogo logo={logo.data[0].image} />
          <HeaderSearch />
          <HeaderRight />
        </div>
      </div>
    </div>
  );
}
