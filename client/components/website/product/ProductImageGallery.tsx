"use client";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Zoom from "react-medium-image-zoom"; // Removed in favor of hover zoom
// import "react-medium-image-zoom/dist/styles.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./heroSectionSlider.css";

// Magnifier Component - Inner Pan Zoom
const MagnifierImage = ({
  src,
  alt,
  hasError,
  onErrorHandler,
}: {
  src: string;
  alt: string;
  hasError: boolean;
  onErrorHandler: () => void;
}) => {
  const [showZoom, setShowZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const currentSrc = hasError ? "/default-placeholder.png" : src;

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-white cursor-crosshair flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={currentSrc}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 1200px) 100vw, 50vw"
        className={`object-contain transition-opacity duration-200 ${
          showZoom && !hasError ? "opacity-0" : "opacity-100"
        }`}
        onError={onErrorHandler}
        priority
      />

      {/* Inner Zoom Overlay */}
      {showZoom && !hasError && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url('${currentSrc}')`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: "250%",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
};

interface ProductImageGalleryProps {
  images?: string | string[];
  thumbnailImage?: string;
  hoverImage?: string;
}

const ProductImageGallery = ({
  images,
  thumbnailImage,
  hoverImage,
}: ProductImageGalleryProps) => {
  const [mainSwiper, setMainSwiper] = useState<any>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [imageError, setImageError] = useState<Set<number>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Collect, normalize, and deduplicate all images: thumbnail + hover + gallery
  const allImages = useMemo(() => {
    const list: string[] = [];

    const add = (item: any) => {
      if (!item) return;
      if (Array.isArray(item)) {
        item.forEach(add);
        return;
      }
      if (typeof item === "string") {
        const parts = item
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        parts.forEach((raw) => {
          const url = getUploadImageUrl(raw, "/default-placeholder.png");
          if (url && !list.includes(url)) {
            list.push(url);
          }
        });
      }
    };

    // 1. Primary thumbnail
    add(thumbnailImage);

    // 2. Secondary hover image
    add(hoverImage);

    // 3. Additional gallery images
    add(images);

    return list.length > 0 ? list : ["/default-placeholder.png"];
  }, [images, thumbnailImage, hoverImage]);

  // Reset errors and index when the images set changes
  useEffect(() => {
    setImageError(new Set());
    setSelectedIndex(0);
  }, [allImages]);

  const handleImageError = (index: number) => {
    setImageError((prev) => new Set(prev).add(index));
  };

  const handleThumbClick = (index: number) => {
    setSelectedIndex(index);
    if (mainSwiper && !mainSwiper.destroyed) {
      if (typeof mainSwiper.slideToLoop === "function") {
        mainSwiper.slideToLoop(index);
      } else if (typeof mainSwiper.slideTo === "function") {
        mainSwiper.slideTo(index);
      }
    }
  };

  const swiperKey = useMemo(() => allImages.join(","), [allImages]);

  return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      {/* Main Gallery Display */}
      <div className="relative w-full aspect-square max-h-[580px] rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm group">
        {/* Navigation Overlays */}
        {allImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none">
            <button
              className="gallery-prev pointer-events-auto w-10 h-10 flex items-center justify-center bg-slate-900/80 backdrop-blur text-white rounded-full shadow-md hover:bg-amber-500 hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 cursor-pointer"
              aria-label="Previous image"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              className="gallery-next pointer-events-auto w-10 h-10 flex items-center justify-center bg-slate-900/80 backdrop-blur text-white rounded-full shadow-md hover:bg-amber-500 hover:text-slate-950 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 cursor-pointer"
              aria-label="Next image"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-slate-950/70 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-white shadow-sm">
          {selectedIndex + 1} / {allImages.length}
        </div>

        <Swiper
          key={`main-${swiperKey}`}
          onSwiper={setMainSwiper}
          loop={allImages.length >= 2}
          spaceBetween={0}
          observer={true}
          observeParents={true}
          className="h-full w-full"
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs]}
          onSlideChange={(swiper) => {
            const idx = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
            setSelectedIndex(idx);
          }}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
        >
          {allImages.map((image: string, idx: number) => {
            const hasError = imageError.has(idx);

            return (
              <SwiperSlide key={idx} className="bg-white flex items-center justify-center relative z-10 p-3 sm:p-5">
                <div className="w-full h-full relative">
                  <MagnifierImage
                    src={image}
                    alt={`Product image ${idx + 1}`}
                    hasError={hasError}
                    onErrorHandler={() => handleImageError(idx)}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Thumbnails (Down / Below Main Image) */}
      {allImages.length > 1 && (
        <div className="w-full flex-shrink-0 pt-1">
          <Swiper
            key={`thumbs-${swiperKey}`}
            onSwiper={(swiper) => setThumbsSwiper(swiper)}
            direction="horizontal"
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            observer={true}
            observeParents={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="w-full thumbs-swiper-horizontal"
          >
            {allImages.map((image: string, idx: number) => {
              const isActive = selectedIndex === idx;
              const hasError = imageError.has(idx);

              return (
                <SwiperSlide
                  key={idx}
                  onClick={() => handleThumbClick(idx)}
                  className={`!w-20 !h-20 sm:!w-22 sm:!h-22 cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                    isActive
                      ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xs opacity-100 scale-102"
                      : "border-slate-200/90 hover:border-slate-400 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-full h-full bg-white">
                    <Image
                      alt={`Thumb ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="90px"
                      className="object-cover"
                      src={hasError ? "/default-placeholder.png" : image}
                      onError={() => handleImageError(idx)}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
