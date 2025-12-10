import { getBrands } from "@/lib/apis/brand";
import { getAntdCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { getDiscounts } from "@/lib/apis/discount";
import { getSizes } from "@/lib/apis/size";
import { getTaxs } from "@/lib/apis/tax";
import { getUnits } from "@/lib/apis/unit";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: 'Edit Product',
  description: 'Edit product details',
};

const AddProduct = dynamic(
  () => import("@/components/dashboard/product/AddProduct"),
  {
    loading: () => "Loading...",
  }
);

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [
    resBrand,
    resSize,
    resUnit,
    resColor,
    resDiscount,
    resCategory,
    resTax,
  ] = await Promise.all([
    getBrands(),
    getSizes(),
    getUnits(),
    getColors(),
    getDiscounts({ scope: "Product" }),
    getAntdCategories(),
    getTaxs(),
  ]);

  return (
    <div className="container mx-auto p-2">
      <AddProduct
        brands={resBrand.data}
        sizes={resSize.data}
        units={resUnit.data}
        colors={resColor.data}
        discounts={resDiscount.data}
        categories={resCategory.data}
        taxs={resTax.data}
        productId={id}
      />
    </div>
  );
}
