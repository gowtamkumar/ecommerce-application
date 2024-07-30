import { getBrands } from "@/lib/apis/brand";
import { getAllCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { getFilterDiscounts } from "@/lib/apis/discount";
import { getSizes } from "@/lib/apis/size";
import { getTaxs } from "@/lib/apis/tax";
import { getUnits } from "@/lib/apis/unit";
import Product from "./Product";

const AddProduct = async () => {
  const resBrand = await getBrands();
  const resSize = await getSizes();
  const resUnit = await getUnits();
  const resColor = await getColors();
  const resDiscount = await getFilterDiscounts({ type: "Discount" });
  const resCategory = await getAllCategories();
  const resTax = await getTaxs();

  return (
    <Product
      sizes={resSize.data}
      brands={resBrand.data}
      units={resUnit.data}
      colors={resColor.data}
      discounts={resDiscount.data}
      categories={resCategory.data}
      taxs={resTax.data}
    />
  );
};

export default AddProduct;
