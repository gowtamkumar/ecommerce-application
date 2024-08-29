import HeaderMenu from "./HeaderMenu";

export default async function MainMenu() {
  // const categories = await getCategories();
  const menu = [
    { key: 'home', label: "Home", url: '/' },
    { key: 'shop', label: "Shop", url: '/shop' },
    { key: 'product', label: "Product", url: '/products' },
    { key: 'blog', label: "Blog", url: '/blog' },
  ]
  return (
   <div className="text-center">
     <HeaderMenu />
   </div>
  );
}
