"use client";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import Image from "next/image";
import Link from "next/link";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import { useSelector } from "react-redux";

export default function FirstWeight() {
  const global = useSelector(selectGlobal);
  const data = global.setting;

  return (
    <div className="flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-4">
        <Image
          src={getImageUrl(data?.image)}
          alt={data?.siteName || "Company Logo"}
          width={150}
          height={60}
          className="h-auto max-h-[60px] w-auto object-contain"
        />
      </div>

      {/* Company Description */}
      <p className="text-sm text-global-footer-text/60 leading-relaxed max-w-xs">
        {data?.description}
      </p>

      {/* Contact Information */}
      <div className="space-y-3 text-sm">
        {data?.address && (
          <div className="flex items-start gap-3 group">
            <HiLocationMarker
              className="w-5 h-5 text-global-primary flex-shrink-0 mt-0.5 
                                       group-hover:scale-110 transition-transform duration-300"
            />
            <address className="not-italic text-global-footer-text/80 group-hover:text-global-footer-text transition-colors duration-300">
              {data.address}
            </address>
          </div>
        )}

        {data?.phone && (
          <div className="flex items-center gap-3 group">
            <HiPhone
              className="w-5 h-5 text-global-primary flex-shrink-0
                               group-hover:scale-110 transition-transform duration-300"
            />
            <Link
              href={`tel:${data.phone}`}
              className="text-global-footer-text/80 hover:text-global-footer-text transition-colors duration-300"
            >
              {data.phone}
            </Link>
          </div>
        )}

        {data?.email && (
          <div className="flex items-center gap-3 group">
            <HiMail
              className="w-5 h-5 text-global-primary flex-shrink-0
                               group-hover:scale-110 transition-transform duration-300"
            />
            <Link
              href={`mailto:${data.email}`}
              className="text-global-footer-text/80 hover:text-global-footer-text transition-colors duration-300"
            >
              {data.email}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
