"use client";

import { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

interface ProductSliderProps {
  headline?: string;
  count?: number;
  source?: "manual" | "collection" | "all";
  productIds?: string[];
  collectionId?: string;
  layout?: "grid" | "slider";
  columns?: number;
  styles?: any;
}

export default function ProductSlider({
  headline = "Featured Products",
  count = 8,
  source = "all",
  productIds = [],
  collectionId,
  layout = "grid",
  columns = 4,
  styles,
}: ProductSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock products for preview - replace with actual API call
    const mockProducts: Product[] = Array.from({ length: count }, (_, i) => ({
      id: `product-${i}`,
      title: `Product ${i + 1}`,
      price: 29.99 + i * 10,
      image: `https://via.placeholder.com/300x400?text=Product+${i + 1}`,
      slug: `product-${i + 1}`,
    }));
    setProducts(mockProducts);
  }, [count, source, productIds, collectionId]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
  };

  return (
    <section
      style={{
        paddingTop: styles?.paddingTop,
        paddingBottom: styles?.paddingBottom,
        backgroundColor: styles?.backgroundColor || "#f9fafb",
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4">
        {headline && (
          <div className="mb-8 flex items-center justify-between">
            <h2
              className="text-3xl font-bold"
              style={{ color: styles?.headlineColor || "#111827" }}
            >
              {headline}
            </h2>
            
            {layout === "slider" && (
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm"
                  aria-label="Previous"
                >
                  <BiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm"
                  aria-label="Next"
                >
                  <BiChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        )}

        {layout === "grid" ? (
          <div
            className={`grid ${gridCols[columns as keyof typeof gridCols] || gridCols[4]} gap-6`}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 hover:text-white transition-colors">
                      ♥
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-600 hover:text-white transition-colors">
                      ♥
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
