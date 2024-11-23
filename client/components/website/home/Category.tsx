import { getPublicCategories } from "@/lib/apis/categories";
import dynamic from "next/dynamic";

const SmallCard = dynamic(() => import("./SmallCard"));

export default async function Category() {
  const categories = await getPublicCategories();
  return <SmallCard categories={categories} />;
}
