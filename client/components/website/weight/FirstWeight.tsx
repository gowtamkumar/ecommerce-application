"use client";
import appConfig from "@/appConfig";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function FirstWeight() {
  const global = useSelector(selectGlobal);
  const data = global.setting;

  return (
    <div className="flex flex-col justify-center items-center md:justify-start md:items-start text-gray-300">
      <Image
        src={
          data?.image
            ? `${appConfig.baseApiUrl}/uploads/${data?.image}`
            : "/pos_software.png"
        }
        alt={data?.image || "weight-image"}
        width="100"
        height="50"
        className="h-[50]"
      />
      <div className="mt-3 ">
        <address>{data?.address}</address>
        <p>Mobile: {data?.phone}</p>
        <Link href={`mailto:${data?.email}`}>E-mail: {data?.email}</Link>
      </div>
    </div>
  );
}
