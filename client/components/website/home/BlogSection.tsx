"use client";
import appConfig from "@/appConfig";
import { getPosts } from "@/lib/apis/posts";
import { errorNotification } from "@/lib/utils/notification";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Spin } from "antd";
import Meta from "antd/es/card/Meta";
import Link from "next/link";
import { useEffect, useState } from "react";

const BlogSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getPosts();
        if (res.success) {
          // Take only the latest 3 posts
          setPosts(res.data.slice(0, 3));
        }
      } catch (error: any) {
        errorNotification({ message: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
      {posts.map((post: any) => (
        <Link href={`/blog/${post.slug || post.id}`} key={post.id} className="block group">
          <Card
            hoverable
            cover={
              <div className="h-48 overflow-hidden">
                <img
                  alt={post.title}
                  src={
                    post.image
                      ? `${appConfig.apiUrl}/uploads/${post.image}`
                      : "https://placehold.co/600x400?text=No+Image"
                  }
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            }
            className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            actions={[
              <div className="flex items-center justify-center gap-2 text-gray-500" key="date">
                <CalendarOutlined />
                <span className="text-xs">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>,
              <div className="flex items-center justify-center gap-2 text-gray-500" key="author">
                <UserOutlined />
                <span className="text-xs">{post.user?.name || "Admin"}</span>
              </div>
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
                    __html: post.content?.replace(/<[^>]+>/g, "").substring(0, 100) + "...",
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
