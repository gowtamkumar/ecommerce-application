import Breadcrumb from "@/components/share-component/Breadcrumb";

export default function page() {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Brands" },
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">All Brands</h1>
      </div>
    </div>
  );
}
