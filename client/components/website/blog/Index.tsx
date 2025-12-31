import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const PostCategory = dynamic(() => import("./PostCategorySection"));
const PostSearchSection = dynamic(() => import("./PostSearchSection"));
const RecentPostSection = dynamic(() => import("./RecentPostSection"));
const Pagination = dynamic(() => import("./Pagination"));
const PostHeader = dynamic(() => import("./PostHeader"));

export default function Index({ posts, searchParams }: any) {
  return (
    <>
      <PostHeader />
      {/* <!-- Main Content --> */}
      <main className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        {/* <!-- Posts Section --> */}
        <section className="w-full lg:w-2/3">
          {/* <!-- Single Post --> */}
          {(posts.data || []).map((post: any) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-10 text-center"
            >
              <Image
                alt={post.title}
                src={getUploadImageUrl(post.image)}
                loading="lazy"
                width={800}
                height={800}
                className="max-w-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div className="flex items-center text-gray-500 text-sm">
                {dayjs(post.createdAt).format("MMMM D, YYYY h:mm A")}
                <div>
                  <ul className="me-2 flex items-center gap-1">
                    {post.postCategories.map((category: any, idx: number) => (
                      <li key={idx}>
                        <span className="mx-2">•</span>
                        {category?.category?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-800 hover:text-gray-600">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="text-gray-600 mt-2">{post.excerpt}</p>

              <div className="mt-4">
                <Link
                  href={`blog/${post.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </article>
          ))}

          {/* <!-- Repeat Post --> */}
          {/* <!-- Add more post articles as needed --> */}

          {/* <!-- Pagination --> */}
          <Pagination meta={posts?.meta} />
        </section>
        {/* <!-- Sidebar Section --> */}
        <aside className="w-full lg:w-1/3">
          {/* <!-- Search --> */}
          <PostSearchSection />
          {/* <!-- Categories --> */}
          <PostCategory searchParams={searchParams} />
          {/* <!-- Recent Posts --> */}
          <RecentPostSection />
          {/* <!-- Tags --> */}
          {/* <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tags</h3>
            <PostTagSection />
          </div> */}
        </aside>
      </main>
    </>
  );
}
