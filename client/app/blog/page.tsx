import Index from "@/components/website/blog/Index";
import { getPosts } from "@/lib/apis/posts";
import React from "react";

export default async function page() {
  const posts = await getPosts();

  // return <Index posts={posts} />;
  return <div>akjaskdf</div>;
}
