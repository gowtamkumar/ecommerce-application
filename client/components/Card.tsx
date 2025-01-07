import appConfig from "@/appConfig";
import { message, Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";
import { saveWishlist } from "@/lib/apis/wishlist";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { setUnAuthorize } from "@/redux/features/global/globalSlice";
interface CardItems {
  id: number;
  name: string;
  hoverImage: string;
  discountAmount: number;
  taxAmount: number;
  thumbnailImage: string;
  unitPrice: string | number;
  discountId: number;
  averageRating: string;
  reviewsCount: string;
  discountValue: string;
  discountType: string;
  slug: string;
  color: any;
  defaultProduct?: {
    id: string;
    unitPrice: number;
    purchasePrice: number;
    size: any;
  };
}

export default function Card({ item }: { item: any }) {
  const dispatch = useDispatch();
  const session = useSession();

  async function AddToWishlist(productId: number) {
    try {
      const res = await saveWishlist({
        productId: productId,
      });

      if (res.success) {
        message.success(`${res.message}`);
      }

      if (!res.success) {
        message.success(`${res.message}`);
      }

      // if (res.status === 500) {
      //   dispatch(setResponse({ type: "error", message: res.message }));
      // } else {
      //   dispatch(
      //     setResponse({ type: "success", message: "successfully Added" })
      //   );
      // }
    } catch (error) {
      console.log("error", error);
    }
  }
  //   <>
  // <div className="relative group">
  //   <Link href={`/product/${item.id}`}>
  //     <Image
  //       src={imageUrl}
  //       alt={item.name}
  //       width={800}
  //       height={800}
  //       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  //     />
  //   </Link>
  //   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer  bg-fixed flex justify-end items-start">
  //     <Link href={`/product/${item.id}`}>
  //       <Image
  //         src={hoverImgUrl}
  //         alt={item.name}
  //         width={800}
  //         height={800}
  //         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  //         className="relative"
  //       />
  //     </Link>
  //     <AddWishlist product_id={+item.id} />
  //   </div>
  // </div>

  // <div className="grid grid-rows-[auto_1fr_auto] h-full">
  //   <div className="py-4">
  //     {+item.discount ? (
  //       <>
  //         <span className="text-red-600 font-bold me-2 text-lg">
  //           ৳{(+item.unit_price - +item.discount).toFixed(2)}
  //         </span>
  //         <span className="text-gray-500 line-through text-lg">
  //           ৳{(+item.unit_price).toFixed(2)}
  //         </span>
  //       </>
  //     ) : (
  //       <span className="text-gray-500  text-lg">
  //         ৳{(+item.unit_price).toFixed(2)}
  //       </span>
  //     )}
  //     <p className="text-bioxin-p font-semibold py-1">
  //       <Link
  //         href={`/product/${item.id}`}
  //         className="text-black hover:underline"
  //       >
  //         {item.name}
  //       </Link>
  //     </p>
  //     <Rate allowHalf value={+item.rating} />
  //   </div>
  //   <AddToCartButton product={item} />
  // </div>
  // </>

  return (
    <div className="border p-3">
      <div className="relative group">
        <Image
          src={
            item.thumbnailImage
              ? `${appConfig.apiUrl}/uploads/${item.thumbnailImage}`
              : "/pos_software.png"
          }
          alt={item.name}
          width={800}
          height={800}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer bg-fixed flex justify-end items-start">
          <Image
            src={
              item.hoverImage
                ? `${appConfig.apiUrl}/uploads/${item.hoverImage}`
                : "/pos_software.png"
            }
            alt={item.name}
            width={800}
            height={800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="relative"
          />
          <button
            onClick={() => {
              if (session.status === "unauthenticated") {
                dispatch(setUnAuthorize(true));
              } else {
                AddToWishlist(item.id);
              }
            }}
            className="mt-4 mr-3 p-4 absolute z-20 hover:border bg-white text-black  rounded-full transform translate-x-10 group-hover:translate-x-0 transition duration-500"
          >
            <FaRegHeart size={22} />
          </button>
        </div>
      </div>

      <div className="p-2 text-sm ">
        <h3 className="font-semibold text-sm mb-2">
          <Link href={`/products/${item.slug}`} className="hover:underline">
            {item.name.slice(0, 50)}
          </Link>
        </h3>
        <span className="flex gap-1 items-center">
          <Rate disabled value={+item.averageRating || 0} />
          {item.reviewsCount && item.reviewsCount}
        </span>

        <div className="flex justify-between items-center">
          <p className="text-gray-500 mb-1 text-md">
            ৳{" "}
            {item?.discountId
              ? (+item.unitPrice - +item.discountAmount).toFixed(2)
              : item.unitPrice}
          </p>
        </div>

        {item?.discountId && (
          <div className="text-xs">
            <span className="line-through text-gray-500">
              ৳ {(+item.unitPrice).toFixed(2)}
            </span>
            <span className="text-red-600 ml-2">
              -{item.discountValue}
              {item?.discountType === "Percentage" ? "%" : "BDT"}
            </span>
          </div>
        )}
      </div>

      <AddToCartButton item={item} />
    </div>
  );
}
