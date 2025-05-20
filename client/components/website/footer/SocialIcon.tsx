"use client";
import appConfig from "@/appConfig";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function SocialIcon() {
  const global = useSelector(selectGlobal);
  const settingData = global.setting;

  return (
    <div className="container mx-auto flex-row text-center md:flex md:items-center md:justify-between py-1">
      <span className="text-sm sm:text-center text-black">
        © {new Date().getFullYear()} {settingData?.footerOption?.copyRight}
      </span>
      <div className="w-full max-w-[900px] mx-auto">
        <Image
          src={
            settingData?.footerOption?.image
              ? `${appConfig.baseApiUrl}/uploads/${settingData?.footerOption?.image}`
              : "/banglargonji-payment-methods.png.webp"
          }
          alt="Payment Gateway"
          width={900}
          height={100} // This helps Next.js set aspect ratio
          className="w-auto h-[50px] mx-auto object-contain"
        />
      </div>
      <div className="flex justify-center md:justify-center space-x-5 text-center text-black">
        {settingData?.socialLink?.linkedinUrl && (
          <Link
            href={settingData?.socialLink?.facebookUrl}
            className=" hover:text-blue-500"
          >
            <FaFacebookF />
          </Link>
        )}

        {settingData?.socialLink?.linkedinUrl && (
          <Link
            href={settingData?.socialLink?.linkedinUrl}
            className=" hover:text-blue-500"
          >
            <FaLinkedinIn />
          </Link>
        )}

        {settingData?.socialLink?.twitterUrl && (
          <Link
            href={settingData?.socialLink?.instagramUrl}
            className=" hover:text-red-500"
          >
            <FaInstagram />
          </Link>
        )}

        {settingData?.socialLink?.twitterUrl && (
          <Link
            href={settingData?.socialLink?.twitterUrl}
            className=" hover:text-blue-500"
          >
            <FaX />
          </Link>
        )}
      </div>
    </div>
  );
}
