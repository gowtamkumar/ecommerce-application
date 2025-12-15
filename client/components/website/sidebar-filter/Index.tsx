"use client";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { useSelector } from "react-redux";
import FilterSidebar from "./FilterSidebar"; // Adjust the path as needed

export default function Index() {
  const global = useSelector(selectGlobal);
  return <>{!global.mobile && <FilterSidebar />}</>;
}
