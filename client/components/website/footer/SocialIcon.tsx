"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function SocialIcon() {
  const global = useSelector(selectGlobal);
  const settingData = global.setting;

  const socialLinks = [
    {
      name: "Facebook",
      icon: <FaFacebookF />,
      url: settingData?.socialLink?.facebookUrl,
      show: settingData?.socialLink?.facebookUrl,
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedinIn />,
      url: settingData?.socialLink?.linkedinUrl,
      show: settingData?.socialLink?.linkedinUrl,
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      url: settingData?.socialLink?.instagramUrl,
      show: settingData?.socialLink?.instagramUrl,
    },
    {
      name: "Twitter/X",
      icon: <FaX />,
      url: settingData?.socialLink?.twitterUrl,
      show: settingData?.socialLink?.twitterUrl,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-global-footer-text/60">
            © {new Date().getFullYear()}{" "}
            {settingData?.footerOption?.copyRight ||
              "E-Commerce. All rights reserved."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-global-footer-text/60 mr-2">
            Follow us:
          </span>
          <div className="flex gap-3">
            {socialLinks
              .filter((link) => link.show)
              .map((social) => (
                <Link
                  key={social.name}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label={social.name}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-base transition-colors duration-200 group-hover:bg-global-primary group-hover:border-transparent">
                    {social.icon}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h4 className="text-sm font-semibold text-global-footer-text/60 uppercase tracking-wider">
          Secure Payment Methods
        </h4>
        <div className="w-full max-w-[900px] mx-auto p-6 rounded-xl bg-global-footer-text/5 border border-global-footer-text/10">
          <Image
            src={getUploadImageUrl(
              settingData?.footerOption?.image,
              "/banglargonji-payment-methods.png.webp"
            )}
            alt="Payment Gateway"
            width={900}
            height={100}
            className="w-full h-auto max-h-[60px] mx-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            priority={false}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-xs text-global-footer-text/60">
          <svg
            className="w-4 h-4 text-global-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure Checkout</span>
        </div>
        <div className="h-4 w-px bg-global-footer-text/20" />
        <div className="flex items-center gap-2 text-xs text-global-footer-text/60">
          <svg
            className="w-4 h-4 text-global-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>SSL Encrypted</span>
        </div>
        <div className="h-4 w-px bg-global-footer-text/20" />
        <div className="flex items-center gap-2 text-xs text-global-footer-text/60">
          <svg
            className="w-4 h-4 text-global-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>100% Authentic</span>
        </div>
      </div>
    </div>
  );
}
