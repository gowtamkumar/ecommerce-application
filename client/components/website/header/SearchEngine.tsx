import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { getPublicProducts } from "@/lib/apis/product";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { setOpen } from "@/redux/features/layout/layoutSlice";
import { Input } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { HiSparkles } from "react-icons/hi";
import { useCurrency } from "@/context/CurrencyContext";

export default function SearchEngine() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const route = useRouter();
  const { formatPrice, selectedCurrency } = useCurrency();

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
    setIsFocused(false);
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full z-50">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchHandle();
        }}
      >
        <div className="relative py-4 md:py-0">
          {/* Search Input */}
          <div className="relative group">
            <Input
              size="large"
              value={query}
              onChange={(e: any) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search for products..."
              className="!h-11 !rounded-full !pl-12
                       !bg-gray-50 !border-gray-200
                       hover:!bg-white hover:!border-gray-300
                       focus:!bg-white focus:!border-global-primary focus:!shadow-[0_0_0_3px_rgba(247,170,14,0.1)]
                       !transition-all !duration-300
                       placeholder:!text-gray-400"
              suffix={
                <div className="flex items-center gap-2">
                  {query && (
                    <CloseCircleFilled
                      className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      onClick={handleClose}
                    />
                  )}
                  <button
                    type="submit"
                    className="!h-9 !w-9 flex items-center justify-center !rounded-full"
                  >
                    <SearchOutlined className="text-base" />
                  </button>
                </div>
              }
            />
            
            {/* Search Icon - Left Side */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchOutlined className="text-gray-400 text-lg" />
            </div>
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isFocused && query && (global.loading.search || results.length > 0) && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0  z-40"
            onClick={handleClose}
          />
          
          {/* Results Container */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl 
                        border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
            {global.loading.search ? (
              // Loading State
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              // Results List
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <HiSparkles className="text-global-primary" />
                  {results.length} Result{results.length !== 1 ? 's' : ''} Found
                </div>
                
                <div className="space-y-1">
                  {results.map((product: any) => {
                    const thumbnailImage = getUploadImageUrl(
                      product.thumbnailImage,
                      "/product-default.png"
                    );

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={handleClose}
                        className="block group"
                      >
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 
                                      transition-all duration-300 cursor-pointer
                                      border border-transparent hover:border-gray-200
                                      hover:shadow-md">
                          {/* Product Image */}
                          <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden
                                        group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={thumbnailImage}
                              fill
                              alt={product.name}
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 group-hover:text-global-primary 
                                         transition-colors duration-300 truncate">
                              {product.name}
                            </h3>
                            <div className="flex flex-col gap-1 mt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">
                                  {formatPrice(product.finalPrice)}
                                </span>
                                {+product.discountValue > 0 && (
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.salePrice)}
                                  </span>
                                )}
                              </div>
                              
                              {+product.discountValue > 0 && (
                                <div className="flex">
                                  <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                    Save {product.discountValue}
                                    {product.discountStrategy === "Percentage"
                                      ? "%"
                                      : selectedCurrency?.symbol}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {product.category && (
                              <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-100 
                                           px-2 py-0.5 rounded-full">
                                {product.category.name}
                              </span>
                            )}
                          </div>
                          
                          {/* Arrow Icon */}
                          <div className="flex-shrink-0 flex items-center">
                            <svg 
                              className="w-5 h-5 text-gray-400 group-hover:text-global-primary 
                                       group-hover:translate-x-1 transition-all duration-300"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                {/* View All Results */}
                {results.length > 0 && (
                  <div className="p-3 border-t border-gray-100 mt-2">
                    <button
                      onClick={searchHandle}
                      className="w-full py-2.5 px-4 bg-gray-50 hover:bg-global-primary hover:text-white
                               text-gray-700 font-medium rounded-lg transition-all duration-300
                               border border-gray-200 hover:border-global-primary"
                    >
                      View All {results.length} Results →
                    </button>
                  </div>
                )}
              </div>
            ) : query ? (
              // Empty State
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <SearchOutlined className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try searching with different keywords
                </p>
                <button
                  onClick={handleClose}
                  className="text-global-primary hover:underline text-sm font-medium"
                >
                  Clear search
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
