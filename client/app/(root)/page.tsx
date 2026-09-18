import CategoryTab from "@/components/website/home/CategoryTab";
import { getHome } from "@/lib/apis/home";
import dynamic from "next/dynamic";
import Link from "next/link";

const CategoryCard = dynamic(
  () => import("@/components/website/home/CategoryCard")
);
const Slider = dynamic(() => import("@/components/website/banner/Slider"));
const PromoBanners = dynamic(
  () => import("@/components/website/banner/PromoBanners")
);
const FeaturedProduct = dynamic(
  () => import("@/components/website/home/FeaturedProduct")
);
const BlogTab = dynamic(() => import("@/components/website/home/BlogSection"));

const SectionHeader = ({
  title,
  subtitle,
  link,
}: {
  title: string;
  subtitle?: string;
  link?: string;
}) => (
  <div className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
    <div className="space-y-1.5">
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm text-gray-500 max-w-xl">{subtitle}</p>
      ) : (
        <div className="h-0.5 w-12 bg-global-primary rounded-full" />
      )}
    </div>

    {link && (
      <Link
        href={link}
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-global-primary transition-colors"
      >
        View all
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
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

  const sectionMap: Record<string, () => React.ReactNode> = {
    slider: () =>
      sliderBanners?.length > 0 ? (
        <div className="w-full relative z-0">
          <Slider banners={sliderBanners} />
        </div>
      ) : null,
    categories: () =>
      categories ? (
        <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Shop by Category"
              subtitle="Find what you need, faster"
              link="/categories"
            />
            <CategoryCard categories={categories} />
          </div>
        </section>
      ) : null,
    featured_products: () =>
      products?.data ? (
        <section className="py-12 sm:py-16 bg-[#fafafa]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Featured Collections"
              subtitle="Handpicked pieces worth exploring"
              link="/products"
            />
            <FeaturedProduct products={featuredProducts} />
          </div>
        </section>
      ) : null,
    promo_banners: () =>
      HomeBanners?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PromoBanners banners={HomeBanners} />
          </div>
        </section>
      ) : null,
    top_selling: () =>
      topSellingProducts?.length > 0 ? (
        <section className="py-12 sm:py-16 bg-[#fafafa] border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="Best Sellers"
              subtitle="Customer favorites this season"
              link="/products"
            />
            <FeaturedProduct products={topSellingProducts} />
          </div>
        </section>
      ) : null,
    new_arrivals: () =>
      products?.data ? (
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title="New Arrivals"
              subtitle="Just landed in the store"
              link="/products"
            />
            <FeaturedProduct products={isNewArrivalProducts} />
          </div>
        </section>
      ) : null,
    category_tabs: () => (
      <section className="py-12 sm:py-16 bg-[#fafafa] border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Browse by Category"
            subtitle="Explore products by department"
            link="/products"
          />
          <CategoryTab categories={categories} />
        </div>
      </section>
    ),
    blog: () => (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="From the Journal"
            subtitle="Stories, tips, and inspiration"
            link="/blog"
          />
          <BlogTab posts={posts || []} />
        </div>
      </section>
    ),
  };

  const orderedSections =
    sectionsConfig.length > 0
      ? [...sectionsConfig]
          .filter((s: any) => s.status !== false)
          .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
          .map((s: any) => s.slug)
      : [
          "slider",
          "categories",
          "featured_products",
          "promo_banners",
          "top_selling",
          "new_arrivals",
          "category_tabs",
          "footer_banners",
          "blog",
        ];

  return (
    <main className="bg-white">
      {orderedSections.map((slug) => (
        <div key={slug}>{sectionMap[slug] ? sectionMap[slug]() : null}</div>
      ))}
    </main>
  );
}
