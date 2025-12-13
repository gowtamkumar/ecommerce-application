"use client";
import AddToCartButton from "@/components/AddToCartButton";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-full">
                    {/* Image Section */}
                    <div className="relative group overflow-hidden bg-gray-50 h-64 md:h-full">
                      {/* Discount Badge */}
                      {item?.discountId && (
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                          -{item.discountValue}
                          {item?.discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol}
                        </div>
                      )}

                      {/* Main Image */}
                      <Image
                        src={thumbnailUrl}
                        alt={item.name}
                        loading="lazy"
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      {/* Hover Image Overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Image
                          src={hoverUrl}
                          alt={item.name}
                          width={1000}
                          height={1000}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => {
                          if (session.status === "unauthenticated") {
                            dispatch(setUnAuthorize(true));
                          } else {
                            AddToWishlist(item.id);
                          }
                        }}
                        className="absolute top-3 right-3 z-10 bg-white p-2.5 rounded-full shadow-md hover:bg-gray-50 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="Add to Wishlist"
                      >
                        <FaRegHeart size={18} className="text-gray-700" />
                      </button>
                    </div>

                    {/* Product Details Section */}
                    <div className="md:col-span-2 p-5 md:p-6 flex flex-col h-full">
                      <div className="flex-1">
                        {/* Product Name */}
                        <Link href={url} className="block mb-3 group">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>

                        {/* Rating and Reviews */}
                        <div className="flex items-center gap-3 mb-4">
                          <Rate disabled value={+item.avgRating || 0} className="text-sm" />
                          {item.reviewsCount > 0 && (
                            <span className="text-sm text-gray-500">
                              ({item.reviewsCount} {item.reviewsCount === 1 ? 'review' : 'reviews'})
                            </span>
                          )}
                        </div>

                        {/* Price Section */}
                        <div className="mb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-2xl md:text-3xl font-bold text-gray-900">
                              {formatPrice(item.finalPrice)}
                            </span>
                            {item?.discountId && (
                              <span className="text-lg text-gray-400 line-through">
                                {formatPrice(item.salePrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <div
                          className="text-sm text-gray-600 prose prose-sm max-w-none line-clamp-3 mb-4"
                          dangerouslySetInnerHTML={{
                            __html: item?.shortDescription,
                          }}
                        />
                      </div>

                      {/* Add to Cart Button */}
                      <div className="mt-auto pt-4 border-t border-gray-100">
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
