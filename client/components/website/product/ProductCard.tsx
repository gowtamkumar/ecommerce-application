"use client";
import AddToCartButton from "@/components/share-component/AddToCartButton";
import Card from "@/components/share-component/Card";
import Pagination from "@/components/share-component/Pagination";
import { useCurrency } from "@/context/CurrencyContext";
import { getPublicProducts } from "@/lib/apis/product";
import { AddToWishlist } from "@/lib/utils/addToWishList";
import { getProductImageUrls } from "@/lib/utils/imageUrl";
import {
  selectGlobal,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProducts,
} from "@/redux/features/products/productSlice";
import { AppDispatch } from "@/redux/store";
import { Rate } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

interface PaginationProps {
  currentPage: number;
  page: number;
  perPage: number;
  total: string;
  totalPages: number;
}

const ProductCard: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationProps>(
    {} as PaginationProps
  );

  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchParams();

  const searchParams = searchQuery.get("search");
  const categoryIdParams = searchQuery.get("categoryId");
  const global = useSelector(selectGlobal);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch<AppDispatch>();
  const session = useSession();
  const params = useParams();
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
    try {
      const products = await getPublicProducts({
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
        discount,
      });

      setPagination({
        currentPage: products?.currentPage,
        page: products?.page,
        perPage: products?.perPage,
        total: products?.total,
        totalPages: products?.totalPages,
      });
      dispatch(setProducts(products?.data));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, [
    brandId,
    colorId,
    currentPage,
    customQuery,
    discount,
    dispatch,
    highPrice,
    lowPrice,
    maxPrice,
    minPrice,
    newSearch,
    rating,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`grid gap-1 ${global.productView ? "grid-cols-1" : "md:grid-cols-5 grid-cols-2"
          }`}
      >
        {products?.map((item: any) => {
          const url = `/product/${item.slug}`;
          const { thumbnailUrl, hoverUrl } = getProductImageUrls(
            item?.thumbnailImage,
            item?.hoverImage
          );
          return (
            <div key={item.id}>
              {global.productView ? (
                <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 h-full flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full md:w-72 md:shrink-0 aspect-[4/5] md:aspect-auto overflow-hidden bg-gray-50">
                      <Link href={url} className="block w-full h-full">
                         <Image
                            src={thumbnailUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                          {/* Hover Image Overlay */}
                          {hoverUrl && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-white">
                                <Image
                                src={hoverUrl}
                                alt={item.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, 300px"
                                />
                            </div>
                          )}
                      </Link>

                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        {item?.discountId && (
                           <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-global-primary text-global-button-text shadow-sm">
                           -{item.discountValue}
                           {item?.discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol}
                         </span>
                        )}
                      </div>

                       {/* Wishlist Button - visible on mobile, hover on desktop */}
                       <div className="absolute top-3 right-3 z-20 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 transition-all duration-300">
                         <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (session.status === "unauthenticated") {
                                dispatch(setUnAuthorize(true));
                              } else {
                                AddToWishlist(item.id);
                              }
                            }}
                            className="w-10 h-10 bg-global-header-bg/80 backdrop-blur text-global-header-text rounded-full flex items-center justify-center shadow-sm hover:bg-global-primary hover:text-global-button-text transition-all duration-300 transform hover:scale-110"
                            title="Add to Wishlist"
                          >
                            <FaRegHeart size={16} />
                          </button>
                       </div>
                    </div>

                    {/* Product Details Section */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col">
                        <div className="flex-1">
                            {/* Rating */}
                             <div className="flex items-center gap-2 mb-3">
                                <Rate disabled value={+item.avgRating || 0} className="text-sm text-amber-400" />
                                <span className="text-sm text-gray-400 font-medium">
                                    ({item.reviewsCount} {item.reviewsCount === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>

                            {/* Product Name */}
                            <Link href={url} className="block mb-3 group/title">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover/title:text-indigo-600 transition-colors">
                                    {item.name}
                                </h3>
                            </Link>

                            {/* Price Section */}
                            <div className="mb-6 flex items-baseline gap-3">
                                <span className="text-2xl md:text-3xl font-bold text-global-text tracking-tight">
                                    {formatPrice(item.finalPrice)}
                                </span>
                                {item?.discountId && (
                                    <span className="text-lg text-global-text/40 line-through decoration-global-text/20">
                                        {formatPrice(item.salePrice)}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div
                                className="text-base text-gray-600 leading-relaxed mb-6 line-clamp-3 md:line-clamp-4"
                                dangerouslySetInnerHTML={{
                                    __html: item?.shortDescription,
                                }}
                            />
                        </div>

                      {/* Add to Cart Button */}
                      <div className="mt-auto md:w-fit">
                        <div className="w-full md:min-w-[200px]">
                           <AddToCartButton item={{ ...item, qty: 1 }} />
                        </div>
                      </div>
                    </div>
                </div>
              ) : (

                <Card item={item} />
              )}
            </div>
          );
        })}
      </div>
      {+pagination.total > +pagination.perPage && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProductCard;
