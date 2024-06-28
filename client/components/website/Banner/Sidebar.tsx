import { getCategories } from "@/lib/apis/categories";
import SidebarMenu from "./SidebarMenu";
import { Suspense } from "react";

export default async function Sidebar() {
  const categories = await getCategories();  
  return (
    <Suspense fallback={<div>loading...</div>}>
      <SidebarMenu categories={categories} />;
    </Suspense>
  );
}
