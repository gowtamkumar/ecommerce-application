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
    <div className="w-full">
      <div
        className={`grid ${
          global.productView 
            ? "grid-cols-1 gap-6" 
            : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
        }`}
      >
        {products?.map((item: any) => {
          const url = `/products/${item.slug}`;
          const { thumbnailUrl, hoverUrl } = getProductImageUrls(
            item?.thumbnailImage,
            item?.hoverImage
          );
          
          return (
            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {global.productView ? (
                <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 flex flex-col md:flex-row h-full">
                    {/* List View Image */}
                    <div className="relative w-full md:w-80 md:shrink-0 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-50">
                      <Link href={url} className="block w-full h-full">
                         <Image
                            src={thumbnailUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          {hoverUrl && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <Image
                                  src={hoverUrl}
                                  alt={item.name}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, 400px"
                                />
                            </div>
                          )}
                      </Link>
                      
                      {/* Discount Badge */}
                      {item?.discountId && (
                        <div className="absolute top-4 left-4 z-10">
                           <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                              -{item.discountValue}{item?.discountStrategy === "Percentage" ? "%" : selectedCurrency?.symbol} OFF
                           </span>
                        </div>
                      )}
                    </div>

                    {/* List View Details */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                        <div className="mb-4 flex items-center gap-2">
                           <Rate disabled value={+item.avgRating || 0} className="text-[10px] text-amber-400" />
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.reviewsCount} Reviews</span>
                        </div>
                        
                        <Link href={url} className="block group/title mb-4">
                           <h3 className="text-xl sm:text-3xl font-black text-gray-900 group-hover/title:text-blue-600 transition-colors leading-tight">
                              {item.name}
                           </h3>
                        </Link>

                        <div className="flex items-center gap-4 mb-6">
                           <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">
                              {formatPrice(item.finalPrice)}
                           </span>
                           {item?.discountId && (
                              <span className="text-lg text-gray-300 line-through font-bold">
                                 {formatPrice(item.salePrice)}
                              </span>
                           )}
                        </div>

                        <div
                          className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 line-clamp-2 sm:line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: item?.shortDescription }}
                        />

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                           <div className="w-full sm:w-48">
                              <AddToCartButton item={{ ...item, qty: 1 }} className="!h-12 !rounded-xl !font-black !text-xs !tracking-widest" />
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
                              className="w-full sm:w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <FaRegHeart size={18} />
                           </button>
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

      {/* Pagination Container */}
      {+pagination.total > +pagination.perPage && (
        <div className="mt-16 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
