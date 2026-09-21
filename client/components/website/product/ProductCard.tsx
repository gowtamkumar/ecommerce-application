"use client";

import AddToCartButton from "@/components/share-component/AddToCartButton";
import Card from "@/components/share-component/Card";
import { useCurrency } from "@/context/CurrencyContext";
import { getPublicProducts } from "@/lib/apis/product";
import { AddToWishlist } from "@/lib/utils/addToWishList";
import { getProductImageUrls } from "@/lib/utils/imageUrl";
import {
    selectGlobal,
    setProductFilter,
    setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import {
    selectProduct,
    setProducts,
} from "@/redux/features/products/productSlice";
import { AppDispatch } from "@/redux/store";
import { Pagination, Rate, Skeleton } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiPackage, FiRotateCcw } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

interface PaginationProps {
  currentPage: number;
  page: number;
  perPage: number;
  total: string | number;
  totalPages: number;
}

const ProductCard: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationProps>(
    {} as PaginationProps
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchParams();

  const searchParams = searchQuery.get("search");
  const categoryIdParams = searchQuery.get("categoryId");
  const featuredParams = searchQuery.get("featured");
  const isNewArrivalParams = searchQuery.get("isNewArrival");
  const discountParams = searchQuery.get("discount");

  const global = useSelector(selectGlobal);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch<AppDispatch>();
  const session = useSession();
  const { formatPrice, selectedCurrency } = useCurrency();

  const {
    categoryId: categoryIds,
    lowPrice,
    highPrice,
    brandId,
    colorId,
    rating,
    minPrice,
    maxPrice,
    discount,
    search: newSearchs,
  } = global.productFilter;

  let customQuery = "";
  if (categoryIdParams) customQuery += categoryIdParams;
  if (categoryIds)
    customQuery += categoryIdParams ? `,${categoryIds}` : categoryIds;
  let newSearch = "";
  if (searchParams) newSearch += searchParams;
  if (newSearchs) newSearch += newSearchs;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPublicProducts({
        page: currentPage,
        categoryId: customQuery,
        brandId,
        search: newSearch,
        lowPrice,
        highPrice,
        colorId,
        rating,
        maxPrice,
        minPrice,
        discount: discount || (discountParams ? 1 : undefined),
        featured: featuredParams ? true : undefined,
        isNewArrival: isNewArrivalParams ? true : undefined,
      });

      setPagination({
        currentPage: res?.currentPage || res?.page || 1,
        page: res?.page || 1,
        perPage: res?.perPage || res?.limit || 12,
        total: res?.totalItem ?? res?.total ?? (res?.data || []).length,
        totalPages: res?.totalPages || 1,
      });
      dispatch(setProducts(res?.data || []));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    brandId,
    colorId,
    currentPage,
    customQuery,
    discount,
    discountParams,
    dispatch,
    featuredParams,
    highPrice,
    isNewArrivalParams,
    lowPrice,
    maxPrice,
    minPrice,
    newSearch,
    rating,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Loading skeleton
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <Skeleton.Image active className="w-full !h-48 rounded-xl" />
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-12 sm:p-16 text-center shadow-xs my-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-5">
          <FiPackage className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-2 tracking-tight">
          No Products Found
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
          We couldn't find any pieces matching your current search or filter combination. Try adjusting or clearing your filters.
        </p>
        <button
          type="button"
          onClick={() => dispatch(setProductFilter({}))}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>Reset all filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`grid ${
          global.productView
            ? "grid-cols-1 gap-6"
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        }`}
      >
        {products.map((item: any) => {
          const url = `/products/${item.slug}`;
          const { thumbnailUrl, hoverUrl } = getProductImageUrls(
            item?.thumbnailImage,
            item?.hoverImage
          );

          return (
            <div
              key={item.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full"
            >
              {global.productView ? (
                /* List View Item */
                <div className="group bg-white rounded-3xl border border-gray-100/90 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 flex flex-col md:flex-row h-full">
                  {/* List View Image */}
                  <div className="relative w-full md:w-72 md:shrink-0 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-50">
                    <Link href={url} className="block w-full h-full">
                      <Image
                        src={thumbnailUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      {hoverUrl && (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <Image
                            src={hoverUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 320px"
                          />
                        </div>
                      )}
                    </Link>

                    {/* Discount Badge */}
                    {item?.discountId && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                          -{item.discountValue}
                          {item?.discountStrategy === "Percentage"
                            ? "%"
                            : selectedCurrency?.symbol}{" "}
                          OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* List View Details */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Rate
                          disabled
                          value={+item.avgRating || 0}
                          className="text-xs text-amber-400"
                        />
                        <span className="text-[11px] font-semibold text-gray-400">
                          ({item.reviewsCount || 0})
                        </span>
                      </div>

                      <Link href={url} className="block group/title mb-3">
                        <h3 className="text-lg sm:text-2xl font-black text-gray-900 group-hover/title:text-global-primary transition-colors leading-snug">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                          {formatPrice(item.finalPrice)}
                        </span>
                        {item?.discountId && (
                          <span className="text-sm text-gray-400 line-through font-bold">
                            {formatPrice(item.salePrice)}
                          </span>
                        )}
                      </div>

                      {item?.shortDescription && (
                        <div
                          className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: item?.shortDescription,
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-gray-100">
                      <div className="w-full sm:w-48">
                        <AddToCartButton
                          item={{ ...item, qty: 1 }}
                          className="h-11 rounded-xl font-bold text-xs tracking-wide"
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (session.status === "unauthenticated") {
                            dispatch(setUnAuthorize(true));
                          } else {
                            AddToWishlist(item.id);
                          }
                        }}
                        className="w-full sm:w-11 h-11 rounded-xl bg-gray-50 hover:bg-rose-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="Add to Wishlist"
                      >
                        <FaRegHeart size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Grid View Item */
                <Card item={item} />
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination Container */}
      {+pagination.total > +pagination.perPage && (
        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400 font-medium">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total products)
          </span>
          <Pagination
            current={+pagination.page || currentPage}
            total={+pagination.total || 0}
            pageSize={+pagination.perPage || 12}
            onChange={(p) => setCurrentPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
