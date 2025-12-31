import { getPosts } from "@/lib/apis/posts";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { FaClock } from "react-icons/fa";

export default async function RecentPostSection() {
  const posts = await getPosts({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });

  if (!posts?.data?.posts || posts?.data?.posts.length === 0) {
     return <p className="text-gray-500 text-sm italic">No recent posts found.</p>;
  }

  return (
    <ul className="space-y-5">
      {(posts?.data?.posts || []).map((post: any) => (
        <li key={post.id} className="group">
          <Link href={`/blog/${post.slug}`} className="flex gap-4 items-start">
             <div className="shrink-0 w-20 h-20 relative rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
              <Image
                alt={post.title}
                src={getUploadImageUrl(post.image)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="80px"
              />
            </div>

            <div className="flex flex-col py-1">
              <h4 className="text-gray-800 group-hover:text-blue-600 font-semibold text-sm line-clamp-2 leading-snug mb-2 transition-colors">
                {post.title}
              </h4>
               <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <FaClock className="text-gray-400" />
                  <span>{dayjs(post.createdAt).format("MMM D, YYYY")}</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
