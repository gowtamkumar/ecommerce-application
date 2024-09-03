import PostCategory from "@/components/website/blog/PostCategorySection";
import PostSearchSection from "@/components/website/blog/PostSearchSection";
import PostTagSection from "@/components/website/blog/PostTagSection";
import RecentPostSection from "@/components/website/blog/RecentPostSection";
import { getPost } from "@/lib/apis/posts";
import dayjs from "dayjs";
import React from "react";

export default async function page({ params }: { params: { id: string } }) {
  console.log("🚀 ~ params:", params);
  // const { id } = useParams();
  const post = await getPost(params);
  console.log("🚀 ~ postss:", post);
  // https://via.placeholder.com/1920x400
  return (
    <div>asdfasdf</div>
    // <>
    //   <div
    //     className="bg-cover bg-center h-64"
    //     // style={{
    //     //   backgroundImage: `url('http://localhost:3900/uploads/${
    //     //     post?.image || "no-data.png"
    //     //   }')`,
    //     // }}
    //   >
    //     <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
    //       <div className="text-center">
    //         <h1 className="text-white text-4xl font-bold uppercase">
    //           {post?.title}
    //         </h1>
    //         <p className="text-gray-300 mt-2">Subtitle or brief description</p>
    //       </div>
    //     </div>
    //   </div>

    //   <main className="container mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
    //     {/* <!-- Post Content Section --> */}
    //     <section className="w-full lg:w-2/3">
    //       {/* <!-- Post Content --> */}
    //       <article className="bg-white rounded-lg shadow-md p-6">
    //         <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
    //           <span>
    //             Posted on {dayjs(post?.createdAt).format("MMMM D, YYYY h:mm A")}
    //           </span>
    //           <div>
    //             {post?.postCategories.map((item: any, idx: number) => (
    //               <span
    //                 key={idx}
    //                 className="bg-blue-600 text-white px-3 py-1 rounded-full"
    //               >
    //                 {item.category.name}
    //               </span>
    //             ))}
    //           </div>
    //         </div>

    //         <div className="text-gray-800 leading-loose">
    //           <p>{post?.content}</p>
    //           {/*
    //           <p className="mb-6">
    //             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
    //             nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed
    //             nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis
    //             ipsum. Praesent mauris.
    //           </p>
    //           <p className="mb-6">
    //             Fusce nec tellus sed augue semper porta. Mauris massa.
    //             Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu
    //             ad litora torquent per conubia nostra, per inceptos himenaeos.
    //             Curabitur sodales ligula in libero.
    //           </p>
    //           <h2 className="text-2xl font-bold mt-8 mb-4">Subheading 1</h2>
    //           <p className="mb-6">
    //             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
    //             nec odio. Praesent libero. Sed cursus ante dapibus diam.
    //           </p>
    //           <h2 className="text-2xl font-bold mt-8 mb-4">Subheading 2</h2>
    //           <p className="mb-6">
    //             Fusce nec tellus sed augue semper porta. Mauris massa.
    //             Vestibulum lacinia arcu eget nulla.
    //           </p>
    //           <blockquote className="border-l-4 border-blue-600 italic pl-4 text-gray-600 mb-6">
    //             This is a quote or important highlight from the content.
    //           </blockquote>
    //           <p className="mb-6">
    //             Class aptent taciti sociosqu ad litora torquent per conubia
    //             nostra, per inceptos himenaeos.
    //           </p> */}
    //         </div>

    //         {/* <!-- Tags --> */}
    //         <PostTagSection />
    //       </article>

    //       {/* <!-- Author Section --> */}
    //       <div className="bg-white rounded-lg shadow-md p-6 mt-10 flex items-center">
    //         {/* <img
    //           src="https://via.placeholder.com/80x80"
    //           alt="Author Image"
    //           className="w-20 h-20 rounded-full mr-6"
    //         /> */}
    //         <div>
    //           <h3 className="text-xl font-semibold text-gray-800">
    //             Author Name
    //           </h3>
    //           <p className="text-gray-600">
    //             Author Bio - A short description of the author’s background and
    //             expertise in the subject matter.
    //           </p>
    //         </div>
    //       </div>

    //       {/* <!-- Comments Section --> */}
    //       <div className="bg-white rounded-lg shadow-md p-6 mt-10">
    //         <h3 className="text-2xl font-semibold text-gray-800 mb-6">
    //           Comments
    //         </h3>
    //         <div className="space-y-6">
    //           <div className="flex">
    //             <img
    //               src="https://via.placeholder.com/50x50"
    //               alt="User Image"
    //               className="w-12 h-12 rounded-full mr-4"
    //             />
    //             <div>
    //               <h4 className="font-semibold text-gray-800">User Name</h4>
    //               <p className="text-gray-600">
    //                 This is a comment by a user on the blog post.
    //               </p>
    //               <span className="text-gray-500 text-sm">August 20, 2023</span>
    //             </div>
    //           </div>
    //           {/* <!-- Repeat for more comments --> */}
    //         </div>

    //         {/* <!-- Comment Form --> */}
    //         <div className="mt-8">
    //           <h4 className="text-xl font-semibold text-gray-800 mb-4">
    //             Leave a Comment
    //           </h4>
    //           <form>
    //             <div className="mb-4">
    //               <label htmlFor="name" className="block text-gray-700">
    //                 Name
    //               </label>
    //               <input
    //                 type="text"
    //                 id="name"
    //                 className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
    //                 placeholder="Your Name"
    //               />
    //             </div>
    //             <div className="mb-4">
    //               <label htmlFor="email" className="block text-gray-700">
    //                 Email
    //               </label>
    //               <input
    //                 type="email"
    //                 id="email"
    //                 className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
    //                 placeholder="Your Email"
    //               />
    //             </div>
    //             <div className="mb-4">
    //               <label htmlFor="comment" className="block text-gray-700">
    //                 Comment
    //               </label>
    //               <textarea
    //                 id="comment"
    //                 rows={4}
    //                 className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
    //                 placeholder="Your Comment"
    //               ></textarea>
    //             </div>
    //             <button
    //               type="submit"
    //               className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    //             >
    //               Submit
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </section>

    //     {/* <!-- Sidebar Section --> */}
    //     <aside className="w-full lg:w-1/3">
    //       {/* <!-- Search --> */}
    //       <PostSearchSection />

    //       {/* <!-- Categories --> */}
    //       <PostCategory />

    //       {/* <!-- Recent Posts --> */}
    //       <RecentPostSection />
    //       {/* <!-- Newsletter Signup --> */}
    //       <div className="bg-white rounded-lg shadow-md p-6">
    //         <h3 className="text-xl font-semibold text-gray-800 mb-4">
    //           Subscribe to Our Newsletter
    //         </h3>
    //         <form>
    //           <div className="mb-4">
    //             <input
    //               type="email"
    //               className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
    //               placeholder="Enter your email"
    //             />
    //           </div>
    //           <button
    //             type="submit"
    //             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    //           >
    //             Subscribe
    //           </button>
    //         </form>
    //       </div>
    //     </aside>
    //   </main>
    // </>
  );
}
