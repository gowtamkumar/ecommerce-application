import { getBrands } from "@/lib/apis/brand";
import { getCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { getDiscounts } from "@/lib/apis/discount";
import { getSizes } from "@/lib/apis/size";
import { getTaxs } from "@/lib/apis/tax";
import { getUnits } from "@/lib/apis/unit";
import dynamic from "next/dynamic";

const AddProduct = dynamic(
  () => import("@/components/dashboard/product/AddProduct"),
  {
    loading: () => "new product loadding............",
  }
);

export default async function Product() {
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
    getCategories(),
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
      />
    </div>
  );
}
