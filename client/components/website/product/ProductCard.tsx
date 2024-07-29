"use client";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProducts,
} from "@/redux/features/products/productSlice";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductCard = () => {
  const { category } = useParams();
  const searchQuery = useSearchParams();
  const searchParams = searchQuery.get("search");
  const categoryIdParams = searchQuery.get("categoryId");

  // hook
  const global = useSelector(selectGlobal);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch();

  const categoryIds = global.productFilter?.categoryId?.toString();
  const lowPrice = global.productFilter.lowPrice;
  const highPrice = global.productFilter.highPrice;
  const brandId = global.productFilter.brandId;
  const colorId = global.productFilter.colorId;
  const rating = global.productFilter.rating;
  const minPrice = global.productFilter.minPrice;
  const maxPrice = global.productFilter.maxPrice;
  const discount = global.productFilter.discount;
  const newSearchs = global.productFilter.search;

  let customQuery = "";

  if (category) {
    customQuery += `${category}`;
  }

  if (categoryIdParams) {
    customQuery += `${categoryIdParams}`;
  }

  if (categoryIds) {
    customQuery +=
      category || categoryIdParams ? `,${categoryIds}` : categoryIds;
  }

  let newSearch = "";

  if (searchParams) {
    newSearch += `${searchParams}`;
  }

  if (newSearchs) {
    newSearch += newSearchs;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getPublicProducts({
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
        dispatch(setProducts(products?.data));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
    console.log("Fetching products with new filter...");
  }, [
    brandId,
    colorId,
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

  return (
    <div
      className={`grid ${
        global.productView ? "grid-cols-2" : "md:grid-cols-5"
      } gap-4`}
    >
      {(products || []).map((item: any, idx: any) => {
        let price = +item.productVariants[0]?.price;
        let discount = item.discount;

        let taxAmount = (+price * (+item?.tax?.value || 0)) / 100;

        let disAmount =
          discount?.discountType === "Percentage"
            ? ((price + taxAmount) * (discount.value || 0)) / 100
            : +discount?.value;

        return (
          <div className="bg-white rounded-lg shadow-md p-4" key={item.id}>
            <Link href={`/products/${item.id}`}>
              <Image
                width={150}
                height={150}
                src="/product-01.jpg"
                alt="Category Image"
                className="w-full h-40 object-cover mb-4"
              />
              <h3 className="text-sm font-semibold mb-2">
                {item.name.slice(0, 70)}
              </h3>
              <p className="text-gray-500 mb-2">
                ৳
                {item?.discountId
                  ? (price + taxAmount - disAmount).toFixed(2)
                  : (price + taxAmount).toFixed(2)}
              </p>

              {item?.discountId ? (
                <>
                  <span className="line-through text-gray-500">
                    ৳ {(+price + +taxAmount || 0).toFixed(2)}
                  </span>
                  <span className="text-green-600 ml-2">
                    -{item?.discount?.value}
                    {item?.discount?.discountType === "Percentage"
                      ? "%"
                      : "BDT"}
                  </span>
                </>
              ) : null}
              <span className="flex gap-1 items-center">
                <Rate allowHalf disabled defaultValue={2.5} />(
                {item.reviews.length})
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
