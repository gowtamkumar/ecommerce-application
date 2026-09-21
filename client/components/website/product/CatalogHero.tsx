"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    FiCompass,
    FiGrid,
    FiPercent,
    FiStar,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

import { selectProduct } from "@/redux/features/products/productSlice";
import { useSelector } from "react-redux";

interface CatalogHeroProps {
  totalCount?: number;
}

export default function CatalogHero({ totalCount: propCount }: CatalogHeroProps) {
  const { products } = useSelector(selectProduct);
  const totalCount = propCount !== undefined ? propCount : products?.length;

  const searchParams = useSearchParams();
  const currentFeatured = searchParams.get("featured");
  const currentNewArrival = searchParams.get("isNewArrival");
  const currentDiscount = searchParams.get("discount");

  const isAll = !currentFeatured && !currentNewArrival && !currentDiscount;

  const NAV_PILLS = [
    {
      label: "All Collections",
      icon: FiGrid,
      href: "/products",
      active: isAll,
    },
    {
      label: "Featured Picks",
      icon: FiStar,
      href: "/products?featured=true",
      active: currentFeatured === "true",
    },
    {
      label: "New Arrivals",
      icon: HiSparkles,
      href: "/products?isNewArrival=true",
      active: currentNewArrival === "true",
    },
    {
      label: "Special Offers",
      icon: FiPercent,
      href: "/products?discount=true",
      active: currentDiscount === "true",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-b border-slate-800">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-3xl space-y-4">
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-xs">
            <FiCompass className="w-3.5 h-3.5" />
            <span>Curated Storefront</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              The Master Collection
            </h1>
            {totalCount !== undefined && totalCount > 0 && (
              <span className="text-xs sm:text-sm font-semibold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full w-fit">
                {totalCount} {totalCount === 1 ? "Product" : "Products"} Available
              </span>
            )}
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Engineered with timeless aesthetics, premium materials, and verified authenticity. Explore handcrafted essentials designed for longevity and modern elegance.
          </p>

          {/* Quick Filter Navigation Pills */}
          <div className="pt-3 flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {NAV_PILLS.map((pill, idx) => {
              const Icon = pill.icon;
              return (
                <Link
                  key={idx}
                  href={pill.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    pill.active
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                      : "bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      pill.active ? "text-slate-950" : "text-amber-400"
                    }`}
                  />
                  <span>{pill.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
