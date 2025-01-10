import appConfig from "@/appConfig";
import { getPost } from "@/lib/apis/posts";
import dayjs from "dayjs";
import dynamic from "next/dynamic";

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

const AuthorSection = dynamic(
  () => import("@/components/website/blog/AuthorSection")
);

export default async function page({ params }: { params: { id: string } }) {
  const { data: post } = await getPost(params);
  return (
    <>
      <div
        className="bg-cover bg-center h-64"
        style={{
          backgroundImage: `url('${appConfig.baseApiUrl}/uploads/${
            post?.image || "no-data.png"
          }')`,
        }}
      >
        <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
          <div className="text-center">
            <h1 className="text-white text-4xl font-bold uppercase">
              {post?.title}
            </h1>
            <p className="text-gray-300 mt-2">{post.content.slice(0, 60)}</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        {/* <!-- Post Content Section --> */}
        <section className="w-full lg:w-2/3">
          {/* <!-- Post Content --> */}
          <article className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
              <span>
                Posted on {dayjs(post?.createdAt).format("MMMM D, YYYY h:mm A")}
              </span>
              <div>
                {post?.postCategories.map((item: any, idx: number) => (
                  <span
                    key={idx}
                    className="bg-blue-600 text-white px-3 py-1 mx-1 rounded-full"
                  >
                    {item.category.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-gray-800 leading-loose">
              <p>{post?.content}</p>
            </div>
            {/* <!-- Tags --> */}
            <PostTagSection tags={post.tags} />
          </article>
          {/* <!-- Author Section --> */}
          <AuthorSection author={post.user} />
          {/* <!-- Comments Section --> */}
          <CommentSection />
        </section>

        {/* <!-- Sidebar Section --> */}
        <aside className="w-full lg:w-1/3">
          {/* <!-- Search --> */}
          <PostSearchSection />
          {/* <!-- Categories --> */}
          <PostCategory />
          {/* <!-- Recent Posts --> */}
          <RecentPostSection />
          {/* <!-- Newsletter Signup --> */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Subscribe to Our Newsletter
            </h3>
            <Subscribe />
          </div>
        </aside>
      </main>
    </>
  );
}
