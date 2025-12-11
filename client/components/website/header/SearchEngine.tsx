import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { setOpen } from "@/redux/features/layout/layoutSlice";
import { Button, Input, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Search } = Input;
import { SearchOutlined } from "@ant-design/icons";

export default function SearchEngine() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState([]);
  // hook
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const route = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);


  const fetchResults = useCallback(async () => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    dispatch(setLoading({ search: true }));
    const res = await getPublicProducts({
      search: debouncedQuery,
    });

    setResults(res.data);
    dispatch(setLoading({ search: false }));
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const searchHandle = () => {
    dispatch(setOpen(false));
    route.push(`/products?search=${query}`);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchHandle();
        }}
      >
        <div className="py-4 md:py-0">
          <Input
            size="large"
            allowClear
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            placeholder="Search for products..."
            draggable
            style={{ height: 40 }}

            suffix={
              <SearchOutlined
                style={{ color: "#aaa", cursor: "pointer", fontSize: 22 }}
                onClick={searchHandle}
              />
            }
          />

        </div>

      </form>
      <div className="absolute z-40 bg-white md:w-[40vw]">
        {global.loading.search
          ? "Loadding..."
          : results.map((product: any) => {
            const thumbnailImage = getUploadImageUrl(product.thumbnailImage, "/product-default.png");

            return (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="flex justify-between gap-10 my-1 rounded-lg bg-gray-100 p-3 items-center">
                  <Image
                    src={thumbnailImage}
                    height={50}
                    width={50}
                    alt={product.name}
                  />
                  <h2>{product.name}</h2>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
