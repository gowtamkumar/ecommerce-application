import { selectGlobal } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import HeaderRight from "./HeaderRight";
import SearchEngine from "./SearchEngine";
const Logo = dynamic(() => import("./Logo"));

export default function SearchSection() {
  const global = useSelector(selectGlobal);

  return (
    <div className="container mx-auto items-center py-1">
      <div className="grid md:grid-cols-12 justify-between items-center">
        {!global.mobile && (
          <div className="col-span-3">
            <Logo />
          </div>
        )}

        <div className="col-span-6 px-5">
          <SearchEngine />
        </div>
        {!global.mobile && (
          <div className="col-span-3">
            <div className="flex md:gap-4 gap-1 justify-end items-center order-3 px-2">
              <HeaderRight />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
