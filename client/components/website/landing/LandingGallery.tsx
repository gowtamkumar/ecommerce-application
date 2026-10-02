"use client";

import { getImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface LandingGalleryProps {
  images: string[];
  productName: string;
}

export default function LandingGallery({
  images,
  productName,
}: LandingGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.png"];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : displayImages.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < displayImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full space-y-3">
      {/* Main Image Showcase */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 shadow-md group">
        <Image
          src={getImageUrl(displayImages[activeIdx])}
          alt={`${productName} view ${activeIdx + 1}`}
          fill
          className="object-cover object-center transition-all duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Carousel controls if multiple images */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all opacity-90 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg flex items-center justify-center transition-all opacity-90 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FiChevronRight className="text-xl" />
            </button>

            {/* Position indicator pill */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full font-bold">
              {activeIdx + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                activeIdx === i
                  ? "border-global-primary ring-2 ring-global-primary/30 scale-95"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
