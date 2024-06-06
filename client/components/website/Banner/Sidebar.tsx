import { GetCategories } from "@/lib/apis/categories";
import SidebarMenu from "./SidebarMenu";
import { Suspense } from "react";

export default async function Sidebar() {
  const categories = await GetCategories();
  return (
    <Suspense fallback={<div>loading...</div>}>
      <SidebarMenu categories={categories?.data} />;
    </Suspense>
  );
}
