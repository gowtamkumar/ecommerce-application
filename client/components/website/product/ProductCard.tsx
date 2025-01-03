"use client";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import {
  selectProduct,
  setProducts,
} from "@/redux/features/products/productSlice";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import Card from "@/components/Card";
import { getHomeApi } from "@/lib/apis/public/home";

const ITEMS_PER_PAGE = 12;

const ProductCard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // const { category } = useParams<{ category: string }>();
  // console.log("🚀 ~ category:", category)
  const searchQuery = useSearchParams();
  const searchParams = searchQuery.get("search");
  const categoryIdParams = searchQuery.get("categoryId");

  const global = useSelector(selectGlobal);
  const { products } = useSelector(selectProduct);
  const dispatch = useDispatch<AppDispatch>();

  const {
    categoryId: categoryIds,
    lowPrice,
    highPrice,
    brandId,
    colorId,
    rating,
    minPrice,
    maxPrice,
    discount,
    search: newSearchs,
  } = global.productFilter;

  let customQuery = "";
  if (categoryIdParams) customQuery += categoryIdParams;
  if (categoryIds)
    customQuery += categoryIdParams ? `,${categoryIds}` : categoryIds;
  // if (categoryIds) customQuery += categoryIds;

  let newSearch = "";
  if (searchParams) newSearch += searchParams;
  if (newSearchs) newSearch += newSearchs;

  // const filteredProducts = ( this code front-end pagination
  //   products.products.slice(
  //     (currentPage - 1) * ITEMS_PER_PAGE,
  //     currentPage * ITEMS_PER_PAGE
  //   ) || []
  // )

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const homeapi = await getHomeApi()
        const products = await getPublicProducts({
          categoryId: customQuery,
          brandId,
          search: newSearch,
          lowPrice,
          highPrice,
          colorId,
          rating,
          maxPrice,
          minPrice,
          discount,
        });
        console.log("homeapi", homeapi?.data);
        console.log("products?.data", products?.data);
        

        dispatch(setProducts(products?.data));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [
    customQuery,
    brandId,
    newSearch,
    lowPrice,
    highPrice,
    colorId,
    rating,
    maxPrice,
    minPrice,
    discount,
    dispatch,
  ]);

  return (
    <div
      className={`grid gap-1 ${
        global.productView ? "grid-cols-1" : "lg:grid-cols-5"
      }`}
    >
      {products?.map((item: any) => (
        <div key={item.id}>
          <Card item={item} />
        </div>
        // <ProductItem key={item.id} item={item} />
      ))}
{/* 
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(products.products.length / ITEMS_PER_PAGE)}
        onPageChange={setCurrentPage}
      /> */}
    </div>
  );
};

export default ProductCard;
