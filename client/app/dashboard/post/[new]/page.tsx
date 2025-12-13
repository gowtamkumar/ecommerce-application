import { getCategories } from "@/lib/apis/categories";
import dynamic from "next/dynamic";

const AddPost = dynamic(() => import("@/components/dashboard/post/AddPost"));

export default async function page() {
  const { data: categories } = await getCategories();

  return (
    <div className="container mx-auto p-2">
      <AddPost categories={categories} />
    </div>
  );
}
