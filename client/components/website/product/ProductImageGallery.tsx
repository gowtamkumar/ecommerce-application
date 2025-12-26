"use client";
import { getImageUrl, getUploadImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";
import { FaExpand, FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import Zoom from "react-medium-image-zoom"; // Removed in favor of hover zoom
// import "react-medium-image-zoom/dist/styles.css";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./heroSectionSlider.css";

// Magnifier Component - Inner Pan Zoom
const MagnifierImage = ({ src, alt, hasError, onErrorHandler }: { src: string, alt: string, hasError: boolean, onErrorHandler: () => void }) => {
    const [showZoom, setShowZoom] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setPosition({ x, y });
        // setCursorPosition({ x: e.clientX - left, y: e.clientY - top });
        setShowZoom(true);
    };

    const handleMouseLeave = () => {
        setShowZoom(false);
    };

    if (hasError) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs font-medium text-gray-400">Unavailable</p>
            </div>
        )
    }

    return (
        <div 
            className="relative w-full h-full overflow-hidden bg-white cursor-crosshair" 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
             <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 1200px) 100vw, 50vw"
                className={`object-contain transition-opacity duration-200 ${showZoom ? 'opacity-0' : 'opacity-100'}`}
                onError={onErrorHandler}
                priority
              />

             {/* Inner Zoom Overlay */}
             {showZoom && (
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `url('${src}')`,
                        backgroundPosition: `${position.x}% ${position.y}%`,
                        backgroundSize: '250%', // 2.5x Zoom
                        backgroundRepeat: 'no-repeat'
                    }}
                />
             )}
        </div>
    )
}

const ProductImageGallery = ({ images }: { images: string }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null) as any;
  const [imageError, setImageError] = useState<Set<number>>(new Set());
  const [selectedIndex, setSelectedIndex] = useState(0);

  const imageArray = images?.split(",").filter(Boolean) || [];
  const newimages = imageArray.length > 0 ? imageArray : ["/pos_software.png"];

  const handleImageError = (index: number) => {
    setImageError((prev) => new Set(prev).add(index));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full h-[600px] lg:h-[700px] font-sans">
      
      {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
      {newimages.length > 1 && (
        <div className="w-full lg:w-24 h-24 lg:h-full flex-shrink-0">
          <Swiper
            onSwiper={(swiper) => setThumbsSwiper(swiper)}
            direction="vertical"
            spaceBetween={12}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-full w-full thumbs-swiper-vertical"
            breakpoints={{
                0: { direction: 'horizontal', slidesPerView: 4, spaceBetween: 10 },
                1024: { direction: 'vertical', slidesPerView: 'auto', spaceBetween: 12 }
            }}
          >
            {newimages.map((item: string, idx: number) => {
              const image = getUploadImageUrl(item, "/default-placeholder.png");
              const isActive = selectedIndex === idx;
              const hasError = imageError.has(idx);

              return (
                <SwiperSlide
                  key={idx}
                  className={`!w-full !h-20 lg:!h-24 cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-gray-900 opacity-100 ring-1 ring-gray-900'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                  }`}
                >
                  <div className="relative w-full h-full bg-white">
                    {hasError ? (
                       <div className="flex items-center justify-center h-full bg-gray-50">
                          <span className="text-[10px] text-gray-400">N/A</span>
                       </div>
                    ) : (
                      <Image
                        alt={`Thumb ${idx}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                        src={image}
                        onError={() => handleImageError(idx)}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Main Gallery Display */}
      <div className="flex-1 relative group rounded-2xl overflow-hidden bg-white border border-gray-100">
        
        {/* Navigation Overlays */}
        {newimages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-20 pointer-events-none">
            <button
              className="gallery-prev pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur text-gray-900 rounded-full shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              className="gallery-next pointer-events-auto w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur text-gray-900 rounded-full shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
              <FaChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-5 right-5 z-20 px-3 py-1 bg-black/5 backdrop-blur-sm rounded-full border border-white/20 text-xs font-bold text-gray-900">
            {selectedIndex + 1} / {newimages.length}
        </div>

        <Swiper
          loop={newimages.length >= 2}
          spaceBetween={0}
          className="h-full w-full"
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

            return (
              <SwiperSlide key={idx} className="bg-white flex items-center justify-center relative z-10 p-4">
                 {/* Only apply magnifier if no error */}
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
    </div>
  );
};

export default ProductImageGallery;
