// "use client";
// import { Rate } from "antd";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { getTopSellingProducts } from "@/lib/apis/reports";
// import appConfig from "@/appConfig";
// import Card from "@/components/Card";

// const TopSellingProductCard = ({topSellingProduct}: any) => {


//   return (
//     <section className="md:py-5 p-3 md:w-8/12 mx-auto">
//       <div className="flex justify-between">
//         <h2 className="text-xl font-semibold pb-8">Best Seller</h2>
//         <Link href={"/products"} className="hover:underline text-xl">
//           View all
//         </Link>
//       </div>
//       <div className="grid gap-1 lg:grid-cols-5">
//         {topSellingProduct?.map((item: any) => (
//           <div key={item.id}>
//             <Card item={item} />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// interface ProductItemProps {
//   item: any;
// }

// const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
//   const price = +item.productVariants[0]?.unitPrice || 0;
//   const reviewsCount = +item?.reviews?.length || 0;
//   const discount = item.discount;
//   const taxAmount = (+price * (+item?.tax?.value || 0)) / 100;

//   const discountAmount =
//     discount?.discountType === "Percentage"
//       ? ((price + taxAmount) * (discount.value || 0)) / 100
//       : +discount?.value || 0;

//   const productRating =
//     item?.reviews?.reduce(
//       (acc: number, review: any) => acc + +review.rating,
//       0
//     ) / reviewsCount;
//   const stockQty = item.productVariants.reduce(
//     (acc: number, variant: any) => acc + +variant.stockQty,
//     0
//   );
//   const image = item?.images?.split(",") || [];

//   return (
//     <div className="bg-white border">
//       <Link href={`/products/${item.id}`} title={item.name}>
//         <Image
//           src={
//             image
//               ? `${appConfig.apiUrl}/uploads/${image[0]}`
//               : "/pos_software.png"
//           }
//           alt={item.name}
//           loading="lazy"
//           // fill
//           width={0}
//           height={0}
//           // placeholder="blur"
//           // blurDataURL={image}
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           className="w-full h-50 mb-2"
//         />
//         <div className="p-2 text-sm">
//           <h3 className="font-semibold text-sm mb-2">
//             {item.name.slice(0, 50)}
//           </h3>
//           <div className="flex justify-between items-center">
//             <p className="text-gray-500 mb-2 text-xs">
//               ৳{" "}
//               {item?.discountId
//                 ? (price + taxAmount - discountAmount).toFixed(2)
//                 : (price + taxAmount).toFixed(2)}
//             </p>
//             <div className={stockQty > 0 ? "text-green-500" : "text-red-500"}>
//               <p className="text-xs">
//                 {" "}
//                 {stockQty > 0 ? "In Stock" : "Out of Stock"}
//               </p>
//             </div>
//           </div>
//           {item?.discountId && (
//             <div className="text-xs">
//               <span className="line-through text-gray-500 ">
//                 ৳ {(price + taxAmount).toFixed(2)}
//               </span>
//               <span className="text-red-600 ml-2">
//                 -{discount?.value}
//                 {discount?.discountType === "Percentage" ? "%" : "BDT"}
//               </span>
//             </div>
//           )}
//           <span className="flex gap-1 items-center">
//             <Rate disabled value={productRating || 0} />({reviewsCount})
//           </span>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default TopSellingProductCard;
