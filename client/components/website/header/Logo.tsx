"use client";
import { selectGlobal, setSetting } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function HeaderLogo({ settingData }: any) {
  const logo = settingData?.data ? settingData.data[0] : {};
  // console.log("🚀 ~ logo:", logo)
  // const global = useSelector(selectGlobal);
  // const dispatch = useDispatch();
  // console.log("window.localStorage.getItem('setting')", window.localStorage.getItem('setting'));

  // if(!global?.setting?.logo){
  //   dispatch(setSetting(logo));
  // }

  // typeof window !== "undefined"
  //   ? localStorage.setItem("setting", JSON.stringify(logo))
  //   : JSON.parse(localStorage.getItem("setting") || "[]");

  //  const settingData =  JSON.parse(localStorage.getItem("setting") || "")

  //   localStorage.setItem("setting", JSON.stringify(setting.data));

  return (
    <div className="w-2/12 md:order-1 order-2">
      <Link href="/">
        <Image
          src={
            logo?.image
              ? `http://localhost:3900/uploads/${logo.image}`
              : "/pos_software.png"
          }
          alt={logo.image}
          loading="lazy"
          width={50}
          height={50}
          className="mx-auto h-10 w-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
    </div>
  );
}
