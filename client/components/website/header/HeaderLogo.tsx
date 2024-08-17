"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeaderLogo({ logo }: { logo: string }) {
  return (
    <div className="w-2/12 text-center">
      <Link href="/">
        <Image
          src={
            logo ? `http://localhost:3900/uploads/${logo}` : "/pos_software.png"
          }
          alt={logo}
          loading="lazy"
          width={50}
          height={50}
          className="mx-auto h-10 w-auto"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* <Image
          width={300}
          height={300}
          className="mx-auto h-10 w-auto"
          src="/pos_software.png"
          alt="Logo"
        /> */}
      </Link>
    </div>
  );
}
