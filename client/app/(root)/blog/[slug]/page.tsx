import appConfig from "@/appConfig";
import PostContent from "@/components/website/blog/PostContent";
import Share from "@/components/website/product/Share";
import { getPost } from "@/lib/apis/posts";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FaCalendar, FaClock } from "react-icons/fa";

const Subscribe = dynamic(
  () => import("@/components/website/footer/Subscribe")
);
const PostTagSection = dynamic(
  () => import("@/components/website/blog/PostTagSection")
);
const RecentPostSection = dynamic(
  () => import("@/components/website/blog/RecentPostSection")
);

const PostSearchSection = dynamic(
  () => import("@/components/website/blog/PostSearchSection")
);

const PostCategory = dynamic(
  () => import("@/components/website/blog/PostCategorySection")
);
const CommentSection = dynamic(
  () => import("@/components/website/blog/CommentSection")
);

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function page({ params, searchParams }: PageProps) {
  const slug = (await params).slug;
  const { data: post } = await getPost(slug);

  // Calculate read time
  const wordsPerMinute = 200;
  const wordCount = post?.content ? post.content.split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <>
      {/* Premium Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-end justify-center overflow-hidden">
        {/* Background Image with Parallax-like effect */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={getUploadImageUrl(post.image)}
            alt={post?.title || "Blog Post"}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Improved Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 pb-16">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            {/* Category Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {post?.postCategories.map((item: any, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg"
                >
                  {item.category.name}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-md">
              {post?.title}
            </h1>

            {/* Meta Data */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-300 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
                  <Image
                    src={getUploadImageUrl(post?.user?.image)}
                    alt={post?.user?.name || "Author"}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span>{post?.user?.name || "Unknown Author"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar />
                <span>{dayjs(post?.createdAt).format("MMMM D, YYYY")}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        {/* <!-- Post Content Section --> */}
        <section className="w-full lg:w-2/3">
          {/* <!-- Post Content --> */}
          <article className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 mb-10">
            {/* Content Body */}
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              prose-headings:font-bold prose-headings:text-gray-900
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
              "
            >
              <PostContent content={post?.content} />
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              {/* <!-- Tags --> */}
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium">Tags:</span>
                <PostTagSection tags={post?.tags || []} />
              </div>
            </div>

            {/* Share Button Placeholder (Functional enhancement for later) */}
            <div className="mt-8 flex justify-end">
              <Share
                value={{
                  url: `${appConfig.publicUrl}/blog/${slug}`,
                  name: post?.title || "Blog Post",
                }}
              />
            </div>
          </article>

          {/* <!-- Author Section --> */}
          {/* <AuthorSection author={post?.user} /> */}

          {/* <!-- Comments Section --> */}
          <CommentSection comments={post?.comments} postId={post?.id} />
        </section>

        {/* <!-- Sidebar Section --> */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* <!-- Search --> */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Search
            </h3>
            <PostSearchSection />
          </div>

          {/* <!-- Categories --> */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Categories
            </h3>
            <PostCategory searchParams={searchParams} />
          </div>

          {/* <!-- Recent Posts --> */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Recent Posts
            </h3>
            <RecentPostSection />
          </div>

          {/* <!-- Newsletter Signup --> */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Join Our Newsletter</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Get the latest updates, offers, and exclusive content directly to
              your inbox.
            </p>
            <div className="newsletter-dark-theme-wrapper">
              <Subscribe />
            </div>
          </div>
        </aside>
      </main>
    </>
  );
}
