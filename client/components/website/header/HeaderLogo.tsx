"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export default function HeaderLogo() {
 
  return (
    <div className="w-2/12 text-center">
      <Link href="/">
        <Image
          width={300}
          height={300}
          className="mx-auto h-10 w-auto"
          src="/pos_software.png"
          alt="Logo"
        />
      </Link>
    </div>
  );
}
