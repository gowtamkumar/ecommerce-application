"use client";

import Link from "next/link";
import { HiChevronRight, HiHome } from "react-icons/hi";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: (BreadcrumbItem | string)[];
  className?: string;
  separator?: "slash" | "chevron" | "dot";
  showHomeIcon?: boolean;
  variant?: "bar" | "clean" | "pill";
}

export default function Breadcrumb({
  items = [],
  className = "",
  separator = "slash",
  showHomeIcon = true,
  variant = "bar",
}: BreadcrumbProps) {
  // Normalize items to BreadcrumbItem[]
  const rawItems: BreadcrumbItem[] = items.map((it) =>
    typeof it === "string" ? { label: it } : it
  );

  // Prepend Home if not already the first item
  const fullItems: BreadcrumbItem[] = [
    ...(rawItems.length === 0 || rawItems[0].label.toLowerCase() !== "home"
      ? [{ label: "Home", href: "/" }]
      : []),
    ...rawItems,
  ];

  // Separator JSX
  const renderSeparator = () => {
    switch (separator) {
      case "chevron":
        return <HiChevronRight className="w-3 h-3 text-gray-300 shrink-0 select-none" />;
      case "dot":
        return <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0 select-none" />;
      case "slash":
      default:
        return <span className="text-gray-300 font-light select-none text-xs">/</span>;
    }
  };

  const navContent = (
    <ol
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-gray-500"
    >
      {fullItems.map((item, idx) => {
        const isLast = idx === fullItems.length - 1;
        const isFirst = idx === 0;

        return (
          <li
            key={idx}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="inline-flex items-center gap-2"
          >
            {idx > 0 && renderSeparator()}

            {isLast || !item.href ? (
              <span
                itemProp="name"
                aria-current="page"
                className="text-global-primary font-bold"
              >
                {item.label}
              </span>
            ) : (
              <Link
                itemProp="item"
                href={item.href}
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors duration-150 group"
              >
                {isFirst && showHomeIcon && (
                  <HiHome className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(idx + 1)} />
          </li>
        );
      })}
    </ol>
  );

  const hasCustomMargin =
    className.includes("mb-") ||
    className.includes("my-") ||
    className.includes("m-");
  const hasCustomBg = className.includes("bg-");

  // Variant 1: "bar" (Standard clean background bar with subtle border)
  if (variant === "bar") {
    return (
      <nav
        aria-label="Breadcrumb"
        className={`w-full ${hasCustomBg ? "" : "bg-gray-50/70"} border-b border-gray-200/60 py-3 ${
          hasCustomMargin ? "" : "mb-6"
        } ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {navContent}
        </div>
      </nav>
    );
  }

  // Variant 2: "pill" (Floating rounded pill)
  if (variant === "pill") {
    return (
      <nav
        aria-label="Breadcrumb"
        className={`inline-flex items-center px-4 py-1.5 rounded-full ${
          hasCustomBg ? "" : "bg-gray-100/80"
        } border border-gray-200/80 shadow-2xs ${
          hasCustomMargin ? "" : "mb-4"
        } ${className}`}
      >
        {navContent}
      </nav>
    );
  }

  // Variant 3: "clean" (Transparent inline navigation)
  return (
    <nav
      aria-label="Breadcrumb"
      className={`py-2 ${hasCustomMargin ? "" : "mb-4"} ${className}`}
    >
      {navContent}
    </nav>
  );
}
