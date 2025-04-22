"use client";
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
// import { getHomeApi } from "@/lib/apis/home";
import { getPublicProducts } from "@/lib/apis/product";
import Pagination from "@/components/Pagination";

const ITEMS_PER_PAGE = 12;

const ProductCard: React.FC = () => {
  const [pagination, setPagination] = useState({});
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

  useEffect(() => {
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

  const fetchProducts = async () => {
    try {
      // const homeapi = await getHomeApi()
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
      const paginate = {
        currentPage: products.currentPage,
        page: products.page,
        perPage: products.perPage,
        total: products.total,
        totalPages: products.totalPages,
      };

      setPagination(paginate);
      dispatch(setProducts(products?.data));
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

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

      {/* <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      /> */}
    </div>
  );
};

export default ProductCard;
