"use client";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const { category } = useParams();
  const searchQuery = useSearchParams();
  const search = searchQuery.get("search");
  const brandId = searchQuery.get("brandId");
  console.log("🚀 ~ searchQuery:", searchQuery.get("search"));
  console.log("🚀 ~ brandId:", searchQuery.get("brandId"));

  useEffect(() => {
    (async () => {
      const products = await getPublicProducts({
        categoryId: category,
        brandId,
        search,
      } as any);
      setProducts(products.data);
    })();
  }, [category, search]);

  // hook

  const global = useSelector(selectGlobal);

  return (
    <div
      className={`grid ${global.productView ? "grid-cols-2" : "grid-cols-5"
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
