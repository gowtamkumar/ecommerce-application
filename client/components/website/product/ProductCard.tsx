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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
// import { GlobalState, Product, ProductVariant, Review } from "@/types"; // Import appropriate types from your types file

const ProductCard: React.FC = () => {
  // const { category } = useParams<{ category: string }>();
  // console.log("🚀 ~ category:", category)
  const searchQuery = useSearchParams();
  const searchParams = searchQuery.get("search");
  const categoryIdParams = searchQuery.get("categoryId");

  const global = useSelector(selectGlobal);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch<AppDispatch>();

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
  // if (categoryIds) customQuery += categoryIds;

  let newSearch = "";
  if (searchParams) newSearch += searchParams;
  if (newSearchs) newSearch += newSearchs;

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
  ]);

  return (
    <div
      className={`grid gap-5 ${global.productView ? "grid-cols-1" : "md:grid-cols-5"
        }`}
    >
      {products?.map((item: any) => (
        <ProductItem key={item.id} item={item} />
      ))}
    </div>
  );
};

interface ProductItemProps {
  item: any;
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
  const price = +item.productVariants[0]?.price || 0;
  const reviewsCount = +item.reviews.length || 0;
  const discount = item.discount;
  const taxAmount = (+price * (+item?.tax?.value || 0)) / 100;

  const disAmount =
    discount?.discountType === "Percentage"
      ? ((price + taxAmount) * (discount.value || 0)) / 100
      : +discount?.value || 0;

  const productRating =
    item.reviews.reduce((acc: number, review: any) => acc + +review.rating, 0) /
    reviewsCount;
  const stockQty = item.productVariants.reduce(
    (acc: number, variant: any) => acc + +variant.stockQty,
    0
  );
  const image = item.images ? item.images[0] : "/pos_software.png";

  return (
    <div className="bg-white border">
      <Link href={`/products/${item.id}`} title={item.name}>
        <Image
          src={
            item.images
              ? `http://localhost:3900/uploads/${item.images[0]}`
              : "/pos_software.png"
          }
          alt={item.name}
          loading="lazy"
          // fill
          width={0}
          height={0}
          // placeholder="blur"
          // blurDataURL={image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-50 mb-2"
        />
        <div className="p-2 text-sm">
          <h3 className="font-semibold text-sm mb-2">{item.name.slice(0, 50)}</h3>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 mb-2 text-xs">
              ৳{" "}
              {item?.discountId
                ? (price + taxAmount - disAmount).toFixed(2)
                : (price + taxAmount).toFixed(2)}
            </p>
            <div className={stockQty > 0 ? "text-green-500" : "text-red-500"}>
              <p className="text-xs"> {stockQty > 0 ? "In Stock" : "Out of Stock"}</p>
            </div>
          </div>
          {item?.discountId && (
            <div className="text-xs">
              <span className="line-through text-gray-500 ">
                ৳ {(price + taxAmount).toFixed(2)}
              </span>
              <span className="text-red-600 ml-2">
                -{discount?.value}
                {discount?.discountType === "Percentage" ? "%" : "BDT"}
              </span>
            </div>
          )}
          <span className="flex gap-1 items-center">
            <Rate disabled value={productRating || 0} />({reviewsCount})
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
