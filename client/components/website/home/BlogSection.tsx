import { getImageUrl } from "@/lib/utils/imageUrl";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import Image from "next/image";
import Link from "next/link";

interface BlogSectionProps {
  posts: any[];
}

const BlogSection = ({ posts }: BlogSectionProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {posts.map((post: any) => (
        <Link
          href={`/blog/${post.slug || post.id}`}
          key={post.id}
          className="block group"
        >
          <Card
            hoverable
            cover={
              <div className="h-48 overflow-hidden relative">
                <Image
                  alt={post.title}
                  src={getImageUrl(post.image)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            }
            className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            actions={[
              <div
                className="flex items-center justify-center gap-2 text-gray-500"
                key="date"
              >
                <CalendarOutlined />
                <span className="text-xs">
                  {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>,
              <div
                className="flex items-center justify-center gap-2 text-gray-500"
                key="author"
              >
                <UserOutlined />
                <span className="text-xs">{post.user?.name || "Admin"}</span>
              </div>,
            ]}
          >
            <Meta
              title={
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
              }
              description={
                <div
                  className="line-clamp-3 text-gray-500 text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      post.content?.replace(/<[^>]+>/g, "").substring(0, 100) +
                      "...",
                  }}
                />
              }
            />
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BlogSection;
