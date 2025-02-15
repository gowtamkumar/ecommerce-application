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

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState([]);
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
        setResults([])
        return
      };
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
    dispatch(setOpen(false))
    route.push(`/products?page=1&limit=10&search=${query}`);
  };

  return (
    <div className="px-10">
      <Space.Compact block>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
        />
        <Button onClick={searchHandle}>Search</Button>
      </Space.Compact>

      <div>
        {global.loading.search
          ? "Loadding..."
          : results.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
            >
              <div className="flex gap-4 border-b p-3 items-center">
                <Image
                  src={`${appConfig.baseApiUrl}/uploads/${product?.thumbnailImage}`}
                  height={50}
                  width={50}
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
