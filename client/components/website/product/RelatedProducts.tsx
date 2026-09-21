"use client";

import Card from "@/components/share-component/Card";
import { getPublicProducts } from "@/lib/apis/product";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowRight, FiCompass } from "react-icons/fi";

interface RelatedProductsProps {
  categoryId?: number | string;
  categoryName?: string;
  currentProductId?: number | string;
}

export default function RelatedProducts({
  categoryId,
  categoryName,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchRelated() {
      try {
        setLoading(true);
        const res = await getPublicProducts({
          categoryId: categoryId ? [categoryId] : undefined,
          perPage: 8,
          page: 1,
        });

        if (res?.data && isMounted) {
          const filtered = res.data.filter(
            (p: any) => String(p.id) !== String(currentProductId)
          );
          setProducts(filtered.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRelated();

    return () => {
      isMounted = false;
    };
  }, [categoryId, currentProductId]);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 sm:mt-28 pt-16 border-t border-slate-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <FiCompass className="w-3.5 h-3.5" />
            <span>Curated Recommendations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            You Might Also Like
          </h2>
          {categoryName && (
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Hand-selected essentials from the{" "}
              <span className="text-slate-900 font-bold">{categoryName}</span>{" "}
              collection
            </p>
          )}
        </div>

        {categoryId && (
          <Link
            href={`/products?categoryId=${categoryId}`}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <span>Explore Collection</span>
            <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Grid or Skeleton Loader */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 animate-pulse"
            >
              <div className="aspect-square bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((item: any) => (
            <div key={item.id} className="h-full">
              <Card item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

