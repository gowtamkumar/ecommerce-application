import { getImageUrl } from "@/lib/utils/imageUrl";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";

interface BlogSectionProps {
  posts: any[];
}

const BlogSection = ({ posts }: BlogSectionProps) => {
  const Meta = Card?.Meta;

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
      {posts.map((post: any) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.id}
          className="block group"
        >
          <Card
            hoverable
            cover={
              <div className="h-56 lg:h-64 overflow-hidden relative">
                <Image
                  alt={post.title}
                  src={getImageUrl(post.image)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            }
            className="h-full border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
            actions={[
              <div
                className="flex items-center justify-center gap-2 text-gray-500 font-medium"
                key="date"
              >
                <CalendarOutlined className="text-global-primary" />
                <span className="text-xs">
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : "Recent"}
                </span>
              </div>,
              <div
                className="flex items-center justify-center gap-2 text-gray-500 font-medium"
                key="author"
              >
                <UserOutlined className="text-global-primary" />
                <span className="text-xs">{post?.user?.name || "Admin"}</span>
              </div>,
            ]}
          >

            {Meta ? (
              <Meta
                title={
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-global-primary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                }
                description={
                  <p className="line-clamp-3 text-gray-500 text-sm mt-3 leading-relaxed"> {post?.content}</p>
                }
              />
            ) : (
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-global-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="line-clamp-3 text-gray-500 text-sm mt-3 leading-relaxed">{post?.content}</p>
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BlogSection;
