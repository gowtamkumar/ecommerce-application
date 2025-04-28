"use client";
import appConfig from "@/appConfig";
import Image from "next/image";
import Link from "next/link";

export default function HeaderLogo({ settingData }: any) {
  const logo = settingData ? settingData[0] : {};

  return (
      <Link href="/">
        <Image
          src={
            logo?.image
              ? `${appConfig.baseApiUrl}/uploads/${logo?.image}`
              : "/pos_software.png"
          }
          alt="logo"
          loading="lazy"
          width={50}
          height={50}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
  );
}
