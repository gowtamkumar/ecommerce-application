import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "Browse products by brand.",
  robots: { index: false, follow: true },
};

export default function BrandPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Brands</h1>
      <p className="text-gray-500">Brand pages are coming soon.</p>
    </div>
  );
}
