import { getPosts } from "@/lib/apis/posts";
import dynamic from "next/dynamic";

const Index = dynamic(() => import("@/components/website/blog/Index"));

export default async function page() {
  const posts = await getPosts();
  return <Index posts={posts} />;
}
