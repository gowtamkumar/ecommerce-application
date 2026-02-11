"use client";

import { useEffect, useState } from "react";
import FeaturedProduct from "@/components/website/home/FeaturedProduct";
import { getProducts } from "@/lib/apis/admin/product";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Fetch products based on source
        if (source === "manual" && productIds && productIds.length > 0) {
          // Fetch specific products by IDs
          const response = await getProducts();
          if (response.success) {
            const filtered = response.data.filter((p: any) => 
              productIds.includes(p.id)
            ).slice(0, count);
            setProducts(filtered);
          }
        } else if (source === "collection" && collectionId) {
          // Fetch products by collection/category
          const response = await getProducts();
          if (response.success) {
            const filtered = response.data.filter((p: any) => 
              p.categoryId === collectionId
            ).slice(0, count);
            setProducts(filtered);
          }
        } else {
          // Fetch all products
          const response = await getProducts();
          if (response.success) {
            setProducts(response.data.slice(0, count));
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [ ]);

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
          <div className="mb-8">
            <h2
              className="text-3xl font-bold"
              style={{ color: styles?.headlineColor || "#111827" }}
            >
              {headline}
            </h2>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : products.length > 0 ? (
          <FeaturedProduct products={products} />
        ) : (
          <div className="text-center py-12 text-slate-500">
            No products available
          </div>
        )}
      </div>
    </section>
  );
}

