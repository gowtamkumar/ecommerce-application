import React from "react";
import WebFooter from "../footer/Footer";
import dayjs from "dayjs";
import Link from "next/link";
import PostCategory from "./PostCategorySection";
import PostSearchSection from "./PostSearchSection";
import RecentPostSection from "./RecentPostSection";
import Pagination from "./Pagination";
import PostHeader from "./PostHeader";

export default function Index({ posts }: any) {
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
              className="bg-white rounded-lg shadow-md overflow-hidden mb-10"
            >
              <img
                src={`http://localhost:3900/uploads/${
                  post.image || "no-data.png"
                }`}
                alt="Post Image"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <span>
                    {dayjs(post.createdAt).format("MMMM D, YYYY h:mm A")}
                  </span>
                  <span>
                    <ul className="me-2 flex items-center gap-1">
                      {post.postCategories.map((category: any, idx: number) => (
                        <li key={idx}>
                          <span className="mx-2">•</span>
                          {category?.category?.name}
                        </li>
                      ))}
                    </ul>
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 hover:text-gray-600">
                  <Link href={`blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-600 mt-4">
                  {post.content.slice(0, 300)}
                </p>
                <div className="mt-4">
                  <Link
                    href={`blog/${post.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {/* <!-- Repeat Post --> */}
          {/* <!-- Add more post articles as needed --> */}

          {/* <!-- Pagination --> */}
          <Pagination />
        </section>
        {/* <!-- Sidebar Section --> */}wq
        <aside className="w-full lg:w-1/3">
          {/* <!-- Search --> */}
          <PostSearchSection />
          {/* <!-- Categories --> */}
          <PostCategory />
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
