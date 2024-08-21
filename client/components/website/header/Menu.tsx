import { getCategories } from "@/lib/apis/categories";
import SidebarMenu from "./HeaderMenu";
import { Suspense } from "react";
import HeaderMenu from "./HeaderMenu";

export default async function MainMenu() {
  const categories = await getCategories();
  return (
    <HeaderMenu categories={categories} />
    // <Suspense fallback={<div>loading...</div>}>
    // </Suspense>
  );
}
