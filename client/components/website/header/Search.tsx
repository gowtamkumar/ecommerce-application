import appConfig from "@/appConfig";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { setOpen } from "@/redux/features/layout/layoutSlice";
import { Button, Input, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  useEffect(() => {
    const fetchResults = async () => {
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
    };

    fetchResults();
  }, [debouncedQuery]);

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
        <Space.Compact block>
          <Input
            type="text"
            size="large"
            allowClear
            draggable
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
          />
          <Button size="large" htmlType="submit">
            Search
          </Button>
        </Space.Compact>
      </form>
      <div className="absolute z-40 bg-white">
        {global.loading.search
          ? "Loadding..."
          : results.map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <div className="flex justify-center gap-10 my-1 rounded-lg bg-gray-100 p-3 items-center">
                  <Image
                    src={`${appConfig.baseApiUrl}/uploads/${product?.thumbnailImage}`}
                    height={100}
                    width={100}
                    alt={product.name}
                  />
                  <h2>{product.name}</h2>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
