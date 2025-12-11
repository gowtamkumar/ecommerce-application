"use client";
import { getImageUrl, getUploadImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import { useState } from "react";
import { FaExpand, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./heroSectionSlider.css";

const ProductImageGallery = ({ images }: { images: string }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;
  const [imageError, setImageError] = useState<Set<number>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Debug: Log what we receive
  console.log("ProductImageGallery - Raw images prop:", images);
  console.log("ProductImageGallery - Type:", typeof images);
  
  // Parse images, filter out empty strings, ensure at least one image
  const imageArray = images?.split(",").filter(Boolean) || [];
  console.log("ProductImageGallery - Parsed array:", imageArray);
  
  const newimages = imageArray.length > 0 ? imageArray : ["/pos_software.png"];
  console.log("ProductImageGallery - Final images:", newimages);

  const handleImageError = (index: number) => {
    console.log("Image failed to load at index:", index);
    setImageError((prev) => new Set(prev).add(index));
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Gallery */}
      <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-lg">
        {/* Fullscreen Indicator */}
        <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaExpand size={12} />
          <span>Click to zoom</span>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {selectedIndex + 1} / {newimages.length}
        </div>

        <Swiper
          loop={newimages.length >= 2}
          spaceBetween={0}
          className="h-[500px] w-full"
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
          navigation={{
            nextEl: ".gallery-next",
            prevEl: ".gallery-prev",
          }}
        >
          {newimages.map((item: string, idx: number) => {
            const image = getImageUrl(item, "/pos_software.png");
            const hasError = imageError.has(idx);
            
            console.log(`Image ${idx}:`, {
              original: item,
              resolved: image,
              hasError
            });

            return (
              <SwiperSlide key={idx} className="bg-white flex items-center justify-center">
                <div className="relative w-full h-full">
                  {hasError ? (
                    // Fallback UI for broken images
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Image not available</p>
                    </div>
                  ) : (
                    <Zoom>
                      <Image
                        src={image}
                        alt={`Product image ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain p-6 transition-transform duration-300"
                        {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                        onError={() => handleImageError(idx)}
                      />
                    </Zoom>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons - Enhanced Design */}
        {newimages.length > 1 && (
          <>
            <button 
              className="gallery-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full shadow-xl text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 hover:shadow-2xl disabled:opacity-0 border border-gray-200"
              aria-label="Previous image"
            >
              <FaChevronLeft size={18} />
            </button>
            <button 
              className="gallery-next absolute top-1/2 right-4 z-10 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/95 backdrop-blur-md rounded-full shadow-xl text-gray-900 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 hover:shadow-2xl disabled:opacity-0 border border-gray-200"
              aria-label="Next image"
            >
              <FaChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - Enhanced Design */}
      {newimages.length > 1 && (
        <div className="relative">
          <Swiper
            onSwiper={(swiper) => setThumbsSwiper(swiper)}
            loop={false}
            spaceBetween={12}
            slidesPerView={6}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-24 w-full thumbs-swiper"
            breakpoints={{
              320: { slidesPerView: 4, spaceBetween: 8 },
              640: { slidesPerView: 5, spaceBetween: 10 },
              1024: { slidesPerView: 6, spaceBetween: 12 }
            }}
          >
            {newimages.map((item: string, idx: number) => {
              const image = getUploadImageUrl(item, "/default-placeholder.png");
              const isActive = selectedIndex === idx;
              const hasError = imageError.has(idx);

              return (
                <SwiperSlide 
                  key={idx} 
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all !h-24 ${
                    isActive 
                      ? 'border-black ring-2 ring-black ring-offset-2 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="relative w-full h-full bg-gray-50">
                    {hasError ? (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ) : (
                      <Image
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="100px"
                        className="object-cover transition-transform hover:scale-105"
                        src={image}
                        onError={() => handleImageError(idx)}
                      />
                    )}
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    )}
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
