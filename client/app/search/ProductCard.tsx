// "use client";
// import { selectGlobal } from "@/redux/features/global/globalSlice";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Divider, Rate, Spin } from "antd";
// import { FaRegHeart } from "react-icons/fa";
// import appConfig from "@/config";
// import ProductNotFound from "@/components/category/ProductNotFound";
// import AddToCartButton from "@/components/AddToCartButton";
// import Card from "@/components/Card";
// import FilterHeader from "@/components/category/HeaderFilter";
// import GlobalSearchPagination from "./GlobalSerchPagination";

// const SearchProductCard = ({ products }: any) => {
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const global = useSelector(selectGlobal);

//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   }, [global.productFilter]);

//   const filteredProducts = products.filter((product: any) => {
//     const {
//       search = "",
//       minPrice = 0,
//       maxPrice = Infinity,
//     } = global.productFilter;
//     // Check if product name matches the search (if provided)
//     const matchesSearch = search
//       ? new RegExp(search, "i").test(product.name)
//       : true;
//     // Check if product is within the price range
//     const withinPriceRange =
//       product.unit_price >= minPrice && product.unit_price <= maxPrice;
//     // Return products that match both conditions
//     return matchesSearch && withinPriceRange;
//   });

//   if (loading) {
//     return (
//       <div className="h-[80vh]">
//         <Spin />
//       </div>
//     );
//   }

//   return (
//     <>
//       <FilterHeader items={filteredProducts.length} />

//       {filteredProducts.length > 0 ? (
//         <div
//           className={`grid gap-5 ${
//             global.productView ? "grid-cols-1" : "lg:grid-cols-4"
//           }`}
//         >
//           {(filteredProducts || []).map((item: any) => {
//             const imageUrl = item.thumbnail_img_url
//               ? item.thumbnail_img_url
//               : "/logo.png";

//             const hoverImgUrl = item.hover_img_url
//               ? item.hover_img_url
//               : "/logo.png";

//             return (
//               <div key={item.id}>
//                 <div
//                   key={item.id}
//                   className={`grid ${
//                     global.productView ? "gap-5 grid-cols-2" : "text-center"
//                   } p-2 h-full`}
//                 >
//                   {global.productView ? (
//                     <>
//                       <div className="relative group text-center md:text-start">
//                         <Link href={`/product/${item.id}`}>
//                           <Image
//                             src={imageUrl}
//                             alt={item.name}
//                             loading="lazy"
//                             width={800}
//                             height={800}
//                             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                           />
//                           {/* Hover Overlay */}
//                           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer bg-bioxin-accent bg-fixed flex justify-end items-start">
//                             <Image
//                               src={hoverImgUrl}
//                               alt={item.name}
//                               loading="lazy"
//                               width={800}
//                               height={800}
//                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                               className="relative"
//                             />
//                             <button className="mt-4 mr-3 p-2 absolute z-10 bg-white text-black  rounded-full transform translate-x-10 group-hover:translate-x-0 transition duration-500">
//                               <FaRegHeart size={22} />
//                             </button>
//                           </div>
//                         </Link>
//                       </div>
//                       <div className="grid grid-rows-[auto_1fr_auto] h-full text-center md:text-start">
//                         <div className="py-4 border-b">
//                           <p className="text-bioxin-p font-semibold">
//                             <Link
//                               href={`/product/${item.id}`}
//                               className="text-black hover:underline"
//                             >
//                               {item.name}
//                             </Link>
//                           </p>
//                           <div className="flex gap-3">
//                             <code>৳{(+item.unit_price || 0).toFixed(2)}</code>
//                             <Rate allowHalf value={+item.rating} />
//                           </div>
//                         </div>
//                         <p
//                           className="text-bioxin-p text-gray-500"
//                           dangerouslySetInnerHTML={{ __html: item?.short_line }}
//                         />

//                         <AddToCartButton product={item} />
//                       </div>
//                     </>
//                   ) : (
//                     <Card item={item} />
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <ProductNotFound />
//       )}

//       <Divider />
//       <div className="flex justify-center pb-4">
//         <GlobalSearchPagination
//           slug={products.slug}
//           currentPage={currentPage}
//           totalPages={Math.ceil(
//             +filteredProducts.length / Number(appConfig.productItemsPerPage)
//           )}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </>
//   );
// };

// export default SearchProductCard;
