// import BreadCrumb from "@/components/Breadcrumb";
// import CategorySidebar from "@/components/category/CategorySidebar";
// import ProductCard from "@/components/category/ProductCard";
// import { getProductBySearch } from "@/lib/apis/product";
// import React from "react";
// import SearchProductCard from "./ProductCard";

// export default async function page({
//   params,
//   searchParams,
// }: {
//   params: any;
//   searchParams: any;
// }) {
//   const productSearch = await getProductBySearch({ search: searchParams.q });

//   return (
//     <section>
//       <BreadCrumb
//         homeElement={"Home"}
//         separator={<span>___</span>}
//         activeClasses="text-amber-500"
//         containerClasses="flex bg-bioxin-accent from-purple-600 to-blue-600"
//         listClasses="hover:underline mx-2 font-bold"
//         capitalizeLinks
//       />
//       {/* <div
//     className="md:bg-center bg-right bg-no-repeat bg-cover bg-bioxin-accent sm:bg-none"
//     style={{ backgroundImage: `url(${categoryBannerImage})` }}
//   >
//     <div className="container mx-auto ">
//       <div className="grid md:text-start text-center items-center bg-bioxin-accent md:bg-transparent bg-none md:h-[50vh] md:py-0 py-12">
//         <h1 className="page-title">{name}</h1>
//         <Image
//           src={mobileBannerImage}
//           alt={name}
//           loading="lazy"
//           width="573"
//           height="713"
//           className="md:hidden"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         />
//       </div>
//     </div>
//   </div> */}

//       <div className="container mx-auto ">
//         <div className="grid md:grid-cols-12 gap-6">
//           <div className="md:col-span-2 py-3 md:flex hidden md:visible">
//             <CategorySidebar />
//           </div>
//           <div className="md:col-span-10 text-center">
//             <SearchProductCard products={productSearch.data} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
