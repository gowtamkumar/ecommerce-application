"use client";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function HeaderLogo() {
  const global = useSelector(selectGlobal);
  const data = global.setting;

  return (
    <Link href="/" className="group relative block">
      <Image
        src={getImageUrl(data?.image)}
        alt={data?.siteName || "Logo"}
        loading="lazy"
        width={120}
        height={50}
        sizes="(max-width: 768px) 80px, (max-width: 1200px) 100px, 120px"
        className="h-auto w-auto max-h-[50px] object-contain transition-all duration-300 group-hover:scale-105"
      />
      
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 bg-gradient-to-r from-global-primary/10 via-transparent to-global-primary/10 blur-xl -z-10 transition-opacity duration-300"></div>
    </Link>
  );
}
