import React from "react";
import TopBar from "./TopBar";
import Logo from "./Logo";
import HeaderRight from "./HeaderRight";
import HeaderSearch from "./HeaderSearch";
import { getSettings } from "@/lib/apis/setting";
import MainMenu from "./Menu";

export default async function Header() {
  //  const res = await saveVisitor({})
  //  console.log("🚀 ~ res:", res)
  const setting = await getSettings();
  // const singleLogo = logo.data ? logo.data[0]?.image : null;
  return (
    <div>
      <TopBar />
      <div className="lg:w-8/12 mx-auto">
        <div className="flex justify-between items-center py-4">
          <Logo settingData={setting} />
          <MainMenu />
          <HeaderRight />
        </div>
      </div>
    </div>
  );
}
