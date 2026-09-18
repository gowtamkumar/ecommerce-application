import { getImageUrl } from "@/lib/utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";

interface BlogSectionProps {
  posts: any[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {posts.map((post: any) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.id}
          className="group block h-full"
        >
          <article className="h-full bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 flex flex-col">
            <div className="h-48 sm:h-56 overflow-hidden relative bg-gray-50">
              <Image
                alt={post.title}
                src={getImageUrl(post.image)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mb-3">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-global-primary" />
                  <span>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1.5 truncate">
                  <FiUser className="text-global-primary" />
                  <span className="truncate">{post?.user?.name || "Admin"}</span>
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-global-primary transition-colors duration-200 line-clamp-2 leading-snug mb-2">
                {post.title}
              </h3>

              {post.content && (
                <p className="line-clamp-2 sm:line-clamp-3 text-sm text-gray-500 leading-relaxed mb-4">
                  {post.content}
                </p>
              )}

              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700 group-hover:text-global-primary transition-colors">
                <span className="uppercase tracking-wider text-[11px]">
                  Read Article
                </span>
                <FiArrowRight className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
