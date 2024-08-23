import { getCategories } from "@/lib/apis/categories";
import HeaderMenu from "./HeaderMenu";

export default async function MainMenu() {
  const categories = await getCategories();
  return (
    <HeaderMenu categories={categories} />
  );
}
