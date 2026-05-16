import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCalendarAlt, FaFolderOpen } from "react-icons/fa";

const PostCategory = dynamic(() => import("./PostCategorySection"));
const PostSearchSection = dynamic(() => import("./PostSearchSection"));
const RecentPostSection = dynamic(() => import("./RecentPostSection"));
const Pagination = dynamic(() => import("./Pagination"));
const PostHeader = dynamic(() => import("./PostHeader"));

export default function Index({ posts, searchParams }: any) {
  const allPosts = posts?.data?.posts || [];
  const featuredPost = allPosts[0];
  const remainingPosts = allPosts.slice(1);

  return (
    <div className="bg-gray-50 min-h-screen">
      <PostHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* <!-- Posts Section --> */}
          <section className="w-full lg:w-2/3 space-y-12">
            
            {/* Featured Post (Editorial Style) */}
            {featuredPost && !searchParams?.search && !searchParams?.category && (
              <article className="group relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2 overflow-hidden">
                    <Image
                      alt={featuredPost.title}
                      src={getUploadImageUrl(featuredPost.image)}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Featured Post
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-2">
                        <FaCalendarAlt className="text-xs" />
                        {dayjs(featuredPost.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all"
                    >
                      Read Full Story <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Grid for Remaining Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(searchParams?.search || searchParams?.category ? allPosts : remainingPosts).map((post: any) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      alt={post.title}
                      src={getUploadImageUrl(post.image)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      {post.postCategories?.[0] && (
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {post.postCategories[0].category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                      <FaCalendarAlt />
                      {dayjs(post.createdAt).format("MMMM D, YYYY")}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-gray-900 font-bold text-sm flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Read More <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {allPosts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-lg">No posts found matching your criteria.</p>
              </div>
            )}

            {/* <!-- Pagination --> */}
            <div className="pt-12">
               <Pagination meta={posts?.meta} />
            </div>
          </section>

          {/* <!-- Sidebar Section --> */}
          <aside className="w-full lg:w-1/3 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              {/* <!-- Search --> */}
              <div className="mb-10">
                <PostSearchSection />
              </div>
              
              {/* <!-- Categories --> */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaFolderOpen className="text-blue-500" /> Categories
                </h3>
                <PostCategory searchParams={searchParams} />
              </div>

              {/* <!-- Recent Posts --> */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaArrowRight className="text-blue-500 rotate-[-45deg]" /> Popular Stories
                </h3>
                <RecentPostSection />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
