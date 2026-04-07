import CategoryTab from "@/components/website/home/CategoryTab";
import { getHome } from "@/lib/apis/home";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically loaded components
const CategoryCard = dynamic(
  () => import("@/components/website/home/CategoryCard")
);
const SellerAds = dynamic(() => import("@/components/website/home/SellerAds"));
const Slider = dynamic(() => import("@/components/website/banner/Slider"));
const PromoBanners = dynamic(
  () => import("@/components/website/banner/PromoBanners")
);
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);

const BlogTab = dynamic(() => import("@/components/website/home/BlogSection"));

// Common Section Title Component for consistency
const SectionHeader = ({ title, link }: { title: string; link?: string }) => (
  <div className="relative mb-10 md:mb-14 flex flex-col md:flex-row justify-between items-center gap-5 w-full">
    <div className="relative z-10 space-y-1.5 flex-1 text-center md:text-left">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-global-text tracking-tight capitalize">
        {title}
      </h2>
      <div className="h-1.5 w-16 bg-gradient-to-r from-global-primary to-transparent rounded-full mx-auto md:mx-0" />
    </div>
    
    {link && (
      <Link
        href={link}
        className="group relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-global-text/5 hover:bg-global-primary hover:text-white hover:shadow-lg hover:shadow-global-primary/30 transition-all duration-300 z-10 overflow-hidden"
      >
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-global-text/70 group-hover:text-white transition-colors">
          View All
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-global-primary group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    )}
  </div>
);

export default async function Home() {
  const [home] = await Promise.all([
    getHome({ page: 1, perPage: 16, featured: true, isNewArrival: true }),
  ]);

  const { banners, posts, categories, products, topSellingProducts } =
    home.data || {};

  const sliderBanners =
    banners?.filter((item: { type: string }) => item.type === "Slider") || [];

  const HomeBanners =
    banners?.filter((item: { type: string }) => item.type === "Banner") || [];

  const featuredProducts = products?.data?.filter(
    (item: { featured: boolean }) => item.featured
  );

  const isNewArrivalProducts = products?.data?.filter(
    (item: { isNewArrival: boolean }) => item.isNewArrival
  );

  const homePageData = home.data?.homePage;
  const sectionsConfig = homePageData?.sections || [];

  // Define available sections and their render functions
  const sectionMap: Record<string, () => React.ReactNode> = {
    slider: () => (
      sliderBanners?.length > 0 ? (
        <div className="w-full relative z-0">
          <Slider banners={sliderBanners} />
        </div>
      ) : null
    ),
    categories: () => (
      categories ? (
        <section className="py-16 sm:py-24 bg-global-bg relative overflow-hidden">
          <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16 relative z-10">
            <SectionHeader title="Shop by Category" link="/categories" />
            <CategoryCard categories={categories} />
          </div>
        </section>
      ) : null
    ),
    featured_products: () => (
      products?.data ? (
        <section className="py-16 sm:py-24 bg-global-card-bg border-y border-global-header-text/5 relative">
          <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16">
            <SectionHeader title="Featured Collections" link="/products" />
            <FeaturedProduct products={featuredProducts} />
          </div>
        </section>
      ) : null
    ),
    promo_banners: () => (
      HomeBanners?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-global-bg">
          <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16">
            <PromoBanners banners={HomeBanners} />
          </div>
        </section>
      ) : null
    ),
    top_selling: () => (
      topSellingProducts?.length > 0 ? (
        <section className="py-16 sm:py-24 bg-global-bg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-global-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16 relative z-10">
            <SectionHeader title="Best Sellers" link="/products" />
            <FeaturedProduct products={topSellingProducts} />
          </div>
        </section>
      ) : null
    ),
    new_arrivals: () => (
      products?.data ? (
        <section className="py-16 sm:py-24 bg-global-card-bg border-y border-global-header-text/5">
          <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16">
            <SectionHeader title="New Arrivals" link="/products" />
            <FeaturedProduct products={isNewArrivalProducts} />
          </div>
        </section>
      ) : null
    ),
    category_tabs: () => (
      <section className="py-16 sm:py-24 bg-global-bg">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16">
          <SectionHeader title="Browse by Category" link="/products" />
          <CategoryTab categories={categories} />
        </div>
      </section>
    ),
    blog: () => (
      <section className="py-20 sm:py-28 bg-gradient-to-b from-global-bg to-global-card-bg border-t border-global-header-text/5">
        <div className="container mx-auto px-5 sm:px-6 lg:px-10 xl:px-16">
          <SectionHeader title="Latest from our Blog" link="/blog" />
          <BlogTab posts={posts || []} />
        </div>
      </section>
    ),
  };

  const orderedSections = sectionsConfig.length > 0
    ? [...sectionsConfig]
      .filter((s: any) => s.status !== false)
      .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
      .map((s: any) => s.slug)
    : ["slider", "categories", "featured_products", "promo_banners", "top_selling", "new_arrivals", "category_tabs", "footer_banners", "blog"];

  return (
    <main className="bg-global-bg">
      {orderedSections.map(slug => (
        <div key={slug}>
          {sectionMap[slug] ? sectionMap[slug]() : null}
        </div>
      ))}
    </main>
  );
}
