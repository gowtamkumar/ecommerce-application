import { getPosts } from "@/lib/apis/posts";
import dynamic from "next/dynamic";

const Index = dynamic(() => import("@/components/website/blog/Index"));

export default async function page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const posts = await getPosts(searchParams);
  return <Index posts={posts} searchParams={searchParams} />;
}
