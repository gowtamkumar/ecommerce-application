"use client";
import {
  selectGlobal,
  setUnAuthorize,
} from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProducts,
} from "@/redux/features/products/productSlice";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Card from "@/components/Card";
import { getPublicProducts } from "@/lib/apis/product";
import Link from "next/link";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { Rate } from "antd";
import AddToCartButton from "@/components/AddToCartButton";
import appConfig from "@/appConfig";
import { AddToWishlist } from "@/lib/utils/addToWishList";
import { useSession } from "next-auth/react";
import Pagination from "@/components/Pagination";

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
  const params = useParams()


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

  useEffect(() => {
    fetchProducts();
  }, [
    customQuery,
    brandId,
    newSearch,
    lowPrice,
    highPrice,
    colorId,
    rating,
    maxPrice,
    minPrice,
    discount,
    dispatch,
    currentPage,
  ]);
  const fetchProducts = async () => {
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
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className={`grid gap-1 ${global.productView ? "grid-cols-1" : "md:grid-cols-5 grid-cols-2"
          }`}
      >
        {products?.map((item: any) => {
          const url = `/product/${item.slug}`;
          const thumbnailImage = item?.thumbnailImage
            ? `${appConfig.baseApiUrl}/uploads/${item?.thumbnailImage}`
            : "/default-placeholder.png";

          const hoverImage = item?.hoverImage
            ? `${appConfig.baseApiUrl}/uploads/${item?.hoverImage}`
            : "/default-placeholder.png";
          return (
            <div key={item.id}>
              {global.productView ? (
                <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-100 p-3 h-full">
                  <div className="relative group text-center md:text-start h-[40vh] overflow-hidden col-span-1">
                    {/* Main Image */}
                    <Image
                      src={thumbnailImage}
                      alt={item.name}
                      loading="lazy"
                      width={1000}
                      height={1000}
                      className="w-full h-full object-fill"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer bg-fixed flex justify-end items-start">
                      <Image
                        src={hoverImage}
                        alt={item.name}
                        width={800}
                        height={800}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="relative"
                      />

                      {/* <div className="p-4 border absolute z-20 bg-white text-black rounded-full transform translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 flex flex-col gap-2 items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"> */}
                      <div className="p-1 absolute z-20 bg-white text-black rounded-lg transform translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition duration-500 flex flex-col gap-2 items-center justify-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            if (session.status === "unauthenticated") {
                              dispatch(setUnAuthorize(true));
                            } else {
                              AddToWishlist(item.id);
                            }
                          }}
                        >
                          <FaRegHeart size={22} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-rows-[auto_1fr_auto] h-full text-center md:text-start col-span-2">
                    <div className="py-4 border-b">
                      <p className="text-bioxin-p font-semibold">
                        <Link href={url} className="text-black hover:underline">
                          {item.name}
                        </Link>
                      </p>
                      <div className="flex gap-3">
                        <code>৳{item.finalPrice}</code>
                        <span className="flex gap-1 items-center">
                          <Rate disabled value={+item.avgRating || 0} />
                          {item.reviewsCount && item.reviewsCount}
                        </span>
                      </div>
                      <div>
                        {item?.discountId && (
                          <div className="text-xs">
                            <span className="line-through text-gray-500">
                              ৳ {item.salePrice}
                            </span>
                            <span className="text-red-600 ml-2">
                              - {item.discountValue}
                              {item?.discountStrategy === "Percentage"
                                ? "%"
                                : "BDT"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p
                      className="text-bioxin-p text-gray-500 prose max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: item?.shortDescription,
                      }}
                    />
                    <div>
                      <AddToCartButton item={{ ...item, qty: 1 }} />
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
