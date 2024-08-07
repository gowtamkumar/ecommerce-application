import React from "react";
import TopBar from "./TopBar";
import HeaderLogo from "./HeaderLogo";
import HeaderRight from "./HeaderRight";
import HeaderSearch from "./HeaderSearch";
import { saveVisitor } from "@/lib/apis/visitor";

export default async function Header() {
  //  const res = await saveVisitor({})
  //  console.log("🚀 ~ res:", res)

  return (
    <div className="bg-rose-400">
      <div className="lg:w-8/12 mx-auto">
        <TopBar />
        <div className="flex items-center py-4 sticky">
          <HeaderLogo />
          <HeaderSearch />
          <HeaderRight />
        </div>
      </div>
    </div>
  );
}
