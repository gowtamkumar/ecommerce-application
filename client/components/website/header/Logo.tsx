"use client";
import appConfig from "@/appConfig";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function HeaderLogo() {
  const global = useSelector(selectGlobal);
  const data = global.setting;
  const route = useRouter();
  return (
    <Image
      src={
        data?.image
          ? `${appConfig.baseApiUrl}/uploads/${data?.image}`
          : "/pos_software.png"
      }
      alt="logo"
      loading="lazy"
      width={80}
      height={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="cursor-pointer"
      onClick={() => {
        route.push("/");
      }}
    />
  );
}
