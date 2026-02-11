// import CategoryTab from "@/components/website/home/CategoryTab";
// import { getHome } from "@/lib/apis/home";
// import { Divider } from "antd";
// import dynamic from "next/dynamic";

// // Dynamically loaded components
// const CategoryCard = dynamic(
//   () => import("@/components/website/home/CategoryCard")
// );
// const SellerAds = dynamic(() => import("@/components/website/home/SellerAds"));
// const Slider = dynamic(() => import("@/components/website/banner/Slider"));
// const PromoBanners = dynamic(
//   () => import("@/components/website/banner/PromoBanners")
// );
// const FeaturedProduct = dynamic(
//   () => import("@/components/website/home/FeaturedProduct")
// );

// const BlogTab = dynamic(() => import("@/components/website/home/BlogSection"));

// export default async function Home() {
//   const [home] = await Promise.all([
//     getHome({ page: 1, perPage: 16, featured: true, isNewArrival: true }),
//   ]);

//   const { banners, posts, categories, products, topSellingProducts } = home.data || {};

//   const sliderBanners =
//     banners?.filter((item: { type: string }) => item.type === "Slider") || [];

//   const HomeBanners =
//     banners?.filter((item: { type: string }) => item.type === "Banner") || [];

//   const featuredProducts = products?.data?.filter(
//     (item: { featured: boolean }) => item.featured
//   );

//   const isNewArrivalProducts = products?.data?.filter(
//     (item: { isNewArrival: boolean }) => item.isNewArrival
//   );

//   // Common Section Title Component for consistency
//   const SectionHeader = ({ title, link }: { title: string; link?: string }) => (
//     <>
//     <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
//       <div>
//         <h2 className="text-global-size-h2 font-bold text-global-text tracking-tight">
//           {title}
//         </h2>
//         <div className="h-1 w-20 bg-global-primary mt-2 rounded-full"></div>
//       </div>
//       {link && (
//         <a
//           href={link}
//           className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-global-hover transition-colors duration-300"
//         >
//           View All Collection
//           <span className="block h-[1px] w-4 bg-gray-400 transition-all duration-300 group-hover:w-8 group-hover:bg-global-hover"></span>
//         </a>
//       )}
//     </div>
//     <Divider/>
//     </>
//   );

//   const homePageData = home.data?.homePage;
//   const sectionsConfig = homePageData?.sections || [];

//   // Define available sections and their render functions
//   const sectionMap: Record<string, () => React.ReactNode> = {
//     slider: () => (
//       sliderBanners?.length > 0 ? (
//         <div className="w-full">
//           <Slider banners={sliderBanners} />
//         </div>
//       ) : null
//     ),
//     categories: () => (
//       categories ? (
//         <section className="py-8 bg-global-bg">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <SectionHeader title="Shop by Category" link="/categories" />
//             <CategoryCard categories={categories} />
//           </div>
//         </section>
//       ) : null
//     ),
//     featured_products: () => (
//       products?.data ? (
//         <section className="py-8 bg-global-card-bg">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <SectionHeader title="Featured Collections" link="/products" />
//             <FeaturedProduct products={featuredProducts} />
//           </div>
//         </section>
//       ) : null
//     ),
//     promo_banners: () => (
//       HomeBanners?.length > 0 ? (
//         <section className="py-8">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <PromoBanners banners={HomeBanners} />
//           </div>
//         </section>
//       ) : null
//     ),
//     top_selling: () => (
//       topSellingProducts?.length > 0 ? (
//         <section className="py-8 bg-global-bg">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <SectionHeader title="Best Sellers" link="/products" />
//             <FeaturedProduct products={topSellingProducts} />
//           </div>
//         </section>
//       ) : null
//     ),
//     new_arrivals: () => (
//       products?.data ? (
//         <section className="py-8 bg-global-card-bg">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//             <SectionHeader title="New Arrivals" link="/products" />
//             <FeaturedProduct products={isNewArrivalProducts} />
//           </div>
//         </section>
//       ) : null
//     ),
//     category_tabs: () => (
//       <section className="py-8 bg-global-bg">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <SectionHeader title="Browse by Category" link="/products" />
//           <CategoryTab categories={categories} />
//         </div>
//       </section>
//     ),
//     blog: () => (
//       <section className="py-24 bg-gradient-to-b from-global-bg to-global-card-bg">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <SectionHeader title="Latest from our Blog" link="/blog" />
//           <BlogTab posts={posts || []} />
//         </div>
//       </section>
//     ),
//   };

//   const orderedSections = sectionsConfig.length > 0
//     ? [...sectionsConfig]
//       .filter((s: any) => s.status !== false)
//       .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
//       .map((s: any) => s.slug)
//     : ["slider", "categories", "featured_products", "promo_banners", "top_selling", "new_arrivals", "category_tabs", "footer_banners", "blog"];

//   return (
//     <main className="bg-global-bg">
//       {orderedSections.map(slug => (
//         <div key={slug}>
//           {sectionMap[slug] ? sectionMap[slug]() : null}
//         </div>
//       ))}
//     </main>
//   );
// }
