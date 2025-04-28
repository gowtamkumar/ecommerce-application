import React from "react";
import dynamic from "next/dynamic";
import HeaderRight from "./HeaderRight";
import SearchEngine from "./Search";
const Logo = dynamic(() => import("./Logo"));

export default function SearchSection() {
  return (
    <div className="container mx-auto items-center py-4">
      <div className="grid md:grid-cols-12 justify-between items-center">
        <div className="col-span-2 bg-blue-400">
          <Logo settingData={{}} />
        </div>
        <div className="col-span-8">
          <SearchEngine />
        </div>
        <div className="col-span-2">
          <HeaderRight />
        </div>
      </div>
    </div>
  );
}
