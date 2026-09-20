"use client";

import Link from "next/link";
import React from "react";
import { HiChevronRight, HiHome } from "react-icons/hi";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBannerProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  subtitle?: string;
  badge?: string;
  theme?: "dark" | "light" | "brand";
  align?: "left" | "center";
  breadcrumbPosition?: "top" | "bottom";
  className?: string;
  children?: React.ReactNode;
}

export default function PageBanner({
  title,
  breadcrumbs = [],
  subtitle,
  badge,
  theme = "dark",
  align = "left",
  breadcrumbPosition = "bottom",
  className = "",
  children,
}: PageBannerProps) {
  const isCenter = align === "center";

  // Prepend Home breadcrumb if not present
  const fullBreadcrumbs: BreadcrumbItem[] = [
    ...(breadcrumbs.length === 0 || breadcrumbs[0].label.toLowerCase() !== "home"
      ? [{ label: "Home", href: "/" }]
      : []),
    ...breadcrumbs,
  ];

  // Theme presets
  const themeStyles = {
    dark: {
      container: "bg-gray-900 border-b border-gray-800 text-white relative overflow-hidden",
      titleColor: "#ffffff",
      subtitle: "text-gray-400",
      pillBg: "bg-white/5 backdrop-blur-md border border-white/10 shadow-2xs",
      crumbText: "text-gray-400 hover:text-white",
      separator: "text-gray-600",
      activeText: "text-global-primary font-black",
      activeDot: "bg-global-primary shadow-sm shadow-global-primary/50",
      glow1: "bg-global-primary/30 opacity-40",
      glow2: "bg-global-primary/15 opacity-20",
    },
    light: {
      container: "bg-white border-b border-gray-200/80 text-gray-900 relative overflow-hidden",
      titleColor: "#111827",
      subtitle: "text-gray-500",
      pillBg: "bg-gray-100/90 border border-gray-200 shadow-2xs",
      crumbText: "text-gray-500 hover:text-gray-900",
      separator: "text-gray-400",
      activeText: "text-global-primary font-black",
      activeDot: "bg-global-primary shadow-sm shadow-global-primary/50",
      glow1: "bg-global-primary/10 opacity-30",
      glow2: "bg-global-primary/5 opacity-20",
    },
    brand: {
      container: "bg-global-primary border-b border-global-hover text-white relative overflow-hidden",
      titleColor: "#ffffff",
      subtitle: "text-white/80",
      pillBg: "bg-white/15 backdrop-blur-md border border-white/25 shadow-2xs",
      crumbText: "text-white/80 hover:text-white",
      separator: "text-white/40",
      activeText: "text-white font-black underline underline-offset-4 decoration-white/60",
      activeDot: "bg-white shadow-sm shadow-white/50",
      glow1: "bg-white/20 opacity-30",
      glow2: "bg-black/10 opacity-20",
    },
  }[theme];

  // Breadcrumb Trail JSX
  const BreadcrumbNav = fullBreadcrumbs.length > 0 && (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center ${isCenter ? "justify-center" : "justify-center sm:justify-start"}`}
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className={`inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${themeStyles.pillBg}`}
      >
        {fullBreadcrumbs.map((crumb, idx) => {
          const isLast = idx === fullBreadcrumbs.length - 1;
          const isFirst = idx === 0;

          return (
            <li
              key={idx}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="inline-flex items-center gap-1.5 sm:gap-2"
            >
              {idx > 0 && (
                <HiChevronRight className={`w-3.5 h-3.5 shrink-0 ${themeStyles.separator}`} />
              )}

              {isLast || !crumb.href ? (
                <span
                  itemProp="name"
                  aria-current="page"
                  className={`inline-flex items-center gap-1.5 ${themeStyles.activeText}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 animate-pulse ${themeStyles.activeDot}`} />
                  <span>{crumb.label}</span>
                </span>
              ) : (
                <Link
                  itemProp="item"
                  href={crumb.href}
                  className={`inline-flex items-center gap-1.5 transition-colors duration-200 group ${themeStyles.crumbText}`}
                >
                  {isFirst && (
                    <HiHome className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span itemProp="name">{crumb.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(idx + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <section className={`py-10 sm:py-14 md:py-16 mb-8 sm:mb-12 ${themeStyles.container} ${className}`}>
      {/* Decorative Ambient Glowing Blobs */}
      <div
        className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40 transition-opacity ${themeStyles.glow1}`}
      />
      <div
        className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none -ml-32 -mb-32 transition-opacity ${themeStyles.glow2}`}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`flex flex-col ${
            isCenter ? "items-center text-center" : "items-center sm:items-start text-center sm:text-left"
          }`}
        >
          {/* Breadcrumb Position: Top */}
          {breadcrumbPosition === "top" && <div className="mb-4">{BreadcrumbNav}</div>}

          {/* Optional Badge */}
          {badge && (
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-global-primary/15 text-global-primary border border-global-primary/30 shadow-2xs">
                {badge}
              </span>
            </div>
          )}

          {/* Page Title (Enforcing Pure Contrast) */}
          <h1
            style={{ color: themeStyles.titleColor }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-3 sm:mb-4 leading-tight"
          >
            {title}
          </h1>

          {/* Optional Subtitle */}
          {subtitle && (
            <p className={`text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed font-normal mb-4 ${themeStyles.subtitle}`}>
              {subtitle}
            </p>
          )}

          {/* Breadcrumb Position: Bottom */}
          {breadcrumbPosition === "bottom" && <div className="mt-2">{BreadcrumbNav}</div>}

          {/* Optional Children (e.g. actions, buttons, search) */}
          {children && <div className="mt-6 w-full">{children}</div>}
        </div>
      </div>
    </section>
  );
}
