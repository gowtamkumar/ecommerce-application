import { getBrands } from "@/lib/apis/brand";
import { getAntdCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { getDiscounts } from "@/lib/apis/discount";
import { getSizes } from "@/lib/apis/size";
import { getTaxs } from "@/lib/apis/tax";
import { getUnits } from "@/lib/apis/unit";
import { Skeleton } from "antd";
import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "New Product",
  description: "Create a new product",
};

const AddProduct = dynamic(
  () => import("@/components/dashboard/product/AddProduct"),
  {
    loading: () => (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
        <Skeleton active paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    ),
  }
);

export default async function NewProductPage() {
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
    <div className="container mx-auto p-4 sm:p-6">
      <AddProduct
        brands={resBrand.data}
        sizes={resSize.data}
        units={resUnit.data}
        colors={resColor.data}
        discounts={resDiscount.data}
        categories={resCategory.data}
        taxs={resTax.data}
      />
    </div>
  );
}
