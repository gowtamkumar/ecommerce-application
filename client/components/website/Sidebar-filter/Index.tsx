"use client";
import React from "react";
import FilterSidebar from "./FilterSidebar"; // Adjust the path as needed
import { useSelector } from "react-redux";
import { selectGlobal } from "@/redux/features/global/globalSlice";

export default function Index() {
  const global = useSelector(selectGlobal);
  return <>{!global.mobile && <FilterSidebar />}</>;
}
