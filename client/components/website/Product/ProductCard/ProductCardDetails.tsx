/* eslint-disable @next/next/no-async-client-component */
"use client";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const ProductCardDetails = ({ products }: any) => {
  const global = useSelector(selectGlobal);

  function productDiscountCalculation(value: any) {
    const price = +value.productVariants[0]?.price;
    const discount = value.discount;
    const dis =
      discount?.discountType === "Percentage"
        ? (price * (discount.value || 0)) / 100
        : +discount?.value;
    return dis;
  }

  return (
    <div
      className={`grid ${global.productView ? "grid-cols-2" : "grid-cols-5"
        } gap-4`}
    >
      {(products.data || []).map((item: any, idx: any) => {

        const price = +item.productVariants[0]?.price;
        const discount = item.discount;
        const disAmount =
          discount?.discountType === "Percentage"
            ? (price * (discount.value || 0)) / 100
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
              <h3 className="text-sm font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 mb-2">
                ৳
                {item?.discountId
                  ? (+item.productVariants[0].price - +disAmount).toFixed(2)
                  : (+item.productVariants[0].price).toFixed(2)}
              </p>

              {item?.discountId ? (
                <>
                  <span className="line-through text-gray-500">
                    ৳ {(+item.productVariants[0].price || 0).toFixed(2)}
                  </span>
                  <span className="text-green-600 ml-2">
                    -{item?.discount?.value}
                    {item?.discount?.discountType === "Percentage"
                      ? "%"
                      : "BDT"}
                  </span>
                </>
              ) : null}
              <Rate allowHalf disabled defaultValue={2.5} />
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCardDetails;
