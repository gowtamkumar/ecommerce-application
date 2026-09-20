"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface AnnouncementBarProps {
  marketing: any;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ marketing }) => {
  const pathname = usePathname();

  // Never show on dashboard routes
  if (pathname?.startsWith("/dashboard")) return null;

  const isEnabled = marketing?.announcementEnabled === true || marketing?.announcementEnabled === "true";
  
  if (!isEnabled || !marketing?.announcementText) {
    return null;
  }

  const barStyle: React.CSSProperties = {
    backgroundColor: marketing.announcementColor || "#000000",
    color: marketing.announcementTextColor || "#ffffff",
  };

  const content = (
    <div 
      className="w-full py-2 px-4 text-center text-sm font-medium transition-all duration-300"
      style={barStyle}
    >
      {marketing.announcementText}
    </div>
  );

  if (marketing.announcementLink) {
    return (
      <Link href={marketing.announcementLink} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

export default AnnouncementBar;
