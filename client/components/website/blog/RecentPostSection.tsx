import { getPosts } from "@/lib/apis/posts";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

export default async function RecentPostSection() {
  const posts = await getPosts({ limit: 5, sortBy: "createdAt", sortOrder: "desc" });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Posts</h3>
      <ul className="space-y-4">
        {
          (!posts?.data?.posts || posts?.data?.posts.length === 0) && (
            <p className="text-gray-500 text-sm">No recent posts found.</p>
          )
        }
        {
          (posts?.data?.posts || []).map((post: any) => (
            <li key={post.id} className="flex gap-4">
              <Link href={`/blog/${post.slug}`} className="shrink-0 w-16 h-16 relative">
                <Image
                  alt={post.title}
                  src={getUploadImageUrl(post.image)}
                  fill
                  className="object-cover rounded-md"
                  sizes="64px"
                />
              </Link>

              <div className="flex flex-col">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gray-800 hover:text-blue-600 font-medium text-sm line-clamp-2 leading-snug mb-1"
                >
                  {post.title}
                </Link>
                <p className="text-gray-500 text-xs">
                  {dayjs(post.createdAt).format("MMM D, YYYY")}
                </p>
              </div>
            </li>
          ))}

      </ul>
    </div>
  );
}
