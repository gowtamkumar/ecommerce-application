import { getBrands } from "@/lib/apis/brand";
import { getAllCategories } from "@/lib/apis/categories";
import { getColors } from "@/lib/apis/color";
import { getFilterDiscounts } from "@/lib/apis/discount";
import { getSizes } from "@/lib/apis/size";
import { getUnits } from "@/lib/apis/unit";
import dynamic from "next/dynamic";
import { getTaxs } from "@/lib/apis/tax";

const AddProduct = dynamic(
  () => import("@/components/dashboard/product/AddProduct"),
  { ssr: false }
);

export default async function Product() {
  // const [brands, setBrands] = useState([])
  // const [sizes, setSizes] = useState([])
  // const [units, setUnits] = useState([])
  // const [colors, setColers] = useState([])
  // const [discounts, setDiscounts] = useState([])
  // const [categories, setCategories] = useState([])
  // const [taxs, setTax] = useState<[]>([])

  // const resBrand = await getBrands();
  // const resSize = await getSizes();
  // const resUnit = await getUnits();
  // const resColor = await getColors();
  // const resDiscount = await getFilterDiscounts({ type: "Discount" });
  // const resCategory = await getAllCategories();
  // const resTax = await getTaxs();


  const [resBrand, resSize, resUnit, resColor, resDiscount, resCategory, resTax] = await Promise.all([getBrands(),
  getSizes(), getUnits(), getColors(),
  getFilterDiscounts({ type: "Discount" }), getAllCategories(),
  getTaxs()]);


  // useEffect(() => {
  //   (async () => {

  //     const resBrand = await getBrands();
  //     const resSize = await getSizes();
  //     const resUnit = await getUnits();
  //     const resColor = await getColors();
  //     const resDiscount = await getFilterDiscounts({ type: "Discount" });
  //     const resCategory = await getAllCategories();
  //     const resTax = await getTaxs();
  //     setBrands(resBrand.data)
  //     setSizes(resSize.data)
  //     setUnits(resUnit.data)
  //     setColers(resColor.data)
  //     setDiscounts(resDiscount.data)
  //     setTax(resTax.data)
  //     setCategories(resCategory.data)

  //   })();
  // }, []);

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
