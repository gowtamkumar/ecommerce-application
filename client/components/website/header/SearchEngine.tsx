"use client";
import { useCurrency } from "@/context/CurrencyContext";
import { getPublicProducts } from "@/lib/apis/product";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { setOpen } from "@/redux/features/layout/layoutSlice";
import {
    ArrowRightOutlined,
    ClockCircleOutlined,
    CloseCircleFilled,
    CloseOutlined,
    FireOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";

// Highlight matching search query characters
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = (text || "").split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span
            key={i}
            className="text-global-primary font-black underline decoration-global-primary/40 underline-offset-2"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default function SearchEngine() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const router = useRouter();
  const { formatPrice } = useCurrency();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ecommerce_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (s) => s.toLowerCase() !== clean.toLowerCase()
      );
      const updated = [clean, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(
          "ecommerce_recent_searches",
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error("Error", e);
        
      }
      return updated;
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      try {
        localStorage.setItem(
          "ecommerce_recent_searches",
          JSON.stringify(updated)
        );
      } catch (e) {
          console.error("Error", e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("ecommerce_recent_searches");
    } catch (e) {
        console.error("Error", e);
    }
  };

  // Debounce user input (250ms for snappy responsiveness)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setSelectedIndex(-1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results based on debounced query
  const fetchResults = useCallback(async () => {
    if (!debouncedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    dispatch(setLoading({ search: true }));
    try {
      const res = await getPublicProducts({
        search: debouncedQuery,
        perPage: 6,
      });
      setResults(res?.data || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setIsSearching(false);
      dispatch(setLoading({ search: false }));
    }
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (searchTerm?: string) => {
    const term = searchTerm ?? query;
    if (!term.trim()) return;
    saveRecentSearch(term);
    dispatch(setOpen(false));
    setIsFocused(false);
    router.push(`/products?search=${encodeURIComponent(term.trim())}`);
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        const selected = results[selectedIndex];
        saveRecentSearch(selected.name);
        setIsFocused(false);
        router.push(`/products/${selected.slug}`);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  // Filter matching categories from global categories
  const matchingCategories = (global?.categories || [])
    .filter((cat: any) =>
      query.trim() &&
      cat?.name?.toLowerCase().includes(query.trim().toLowerCase())
    )
    .slice(0, 3);

  // Top popular categories to recommend when input is empty
  const popularCategories = (global?.categories || []).slice(0, 5);

  return (
    <div ref={containerRef} className="relative w-full z-50">
      {/* Search Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit();
        }}
        className="w-full"
      >
        <div
          className={`relative flex items-center h-11 w-full rounded-full border bg-white/90 backdrop-blur-xs transition-all duration-300 shadow-2xs ${
            isFocused
              ? "border-global-primary ring-4 ring-global-primary/10 shadow-md bg-white"
              : "border-gray-200/90 hover:border-gray-300 hover:bg-white"
          }`}
        >
          {/* Left Magnifying Icon */}
          <div className="pl-4 pr-2 flex items-center justify-center shrink-0">
            <SearchOutlined
              className={`text-base transition-colors duration-200 ${
                isFocused ? "text-global-primary" : "text-gray-400"
              }`}
            />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands, categories..."
            autoComplete="off"
            className="w-full h-full bg-transparent text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-hidden pr-2"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClose}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <CloseCircleFilled className="text-sm" />
            </button>
          )}

          {/* Right Submit Button */}
          <div className="pr-1.5 shrink-0">
            <button
              type="submit"
              aria-label="Search"
              className="w-8 h-8 rounded-full bg-global-primary hover:bg-global-hover text-white flex items-center justify-center shadow-xs transition-all duration-200 active:scale-90"
            >
              <SearchOutlined className="text-xs" />
            </button>
          </div>
        </div>
      </form>

      {/* Dropdown Container */}
      {isFocused && (
        <>
          {/* Subtle click-away backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/10 backdrop-blur-2xs"
            onClick={() => setIsFocused(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 divide-y divide-gray-100">
            {/* ================= SCENARIO 1: INPUT IS EMPTY (RECENT & TRENDING) ================= */}
            {!query.trim() && (
              <div className="p-4 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <ClockCircleOutlined className="text-gray-400" />
                        <span>Recent Searches</span>
                      </span>
                      <button
                        type="button"
                        onClick={clearAllRecentSearches}
                        className="text-[11px] font-medium lowercase text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setQuery(term);
                            handleSearchSubmit(term);
                          }}
                          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200/80 text-xs font-medium text-gray-700 hover:border-global-primary hover:text-global-primary hover:bg-global-primary/5 cursor-pointer transition-all duration-200"
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            onClick={(e) => removeRecentSearch(e, term)}
                            className="text-gray-400 hover:text-gray-600 p-0.5"
                          >
                            <CloseOutlined className="text-[10px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                {popularCategories.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <FireOutlined className="text-amber-500" />
                      <span>Popular Categories</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {popularCategories.map((cat: any) => (
                        <Link
                          key={cat.id}
                          href={`/products?categoryId=${cat.id}`}
                          onClick={() => setIsFocused(false)}
                          className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-150 text-xs font-semibold text-gray-700 hover:bg-global-primary hover:text-white hover:border-global-primary transition-all duration-200 shadow-2xs"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= SCENARIO 2: SEARCHING / RESULTS ================= */}
            {query.trim() && (
              <div>
                {/* Category Matches */}
                {matchingCategories.length > 0 && (
                  <div className="p-3 bg-gray-50/70">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 px-1">
                      Categories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchingCategories.map((cat: any) => (
                        <Link
                          key={cat.id}
                          href={`/products?categoryId=${cat.id}`}
                          onClick={() => {
                            saveRecentSearch(cat.name);
                            setIsFocused(false);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-global-primary hover:text-global-primary text-xs font-bold text-gray-800 transition-all shadow-2xs group"
                        >
                          <HighlightText text={cat.name} highlight={query} />
                          <ArrowRightOutlined className="text-[10px] text-gray-400 group-hover:text-global-primary transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading Skeleton */}
                {isSearching ? (
                  <div className="p-3 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-2.5 rounded-xl animate-pulse bg-gray-50"
                      >
                        <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  /* Products Result List */
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <HiSparkles className="text-global-primary" />
                        <span>Products ({results.length})</span>
                      </span>
                      <span className="text-[10px] font-normal text-gray-400 normal-case hidden sm:inline">
                        Use ↑↓ to navigate, Enter to select
                      </span>
                    </div>

                    {results.map((product: any, idx: number) => {
                      const thumbnailImage = getUploadImageUrl(
                        product.thumbnailImage,
                        "/product-default.png"
                      );
                      const isHighlighted = idx === selectedIndex;

                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            saveRecentSearch(product.name);
                            setIsFocused(false);
                          }}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group border ${
                            isHighlighted
                              ? "bg-global-primary/5 border-global-primary/30"
                              : "hover:bg-gray-50/80 border-transparent hover:border-gray-100"
                          }`}
                        >
                          {/* Image */}
                          <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={thumbnailImage}
                              fill
                              alt={product.name}
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-global-primary transition-colors truncate">
                              <HighlightText
                                text={product.name}
                                highlight={query}
                              />
                            </h4>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-gray-900">
                                {formatPrice(product.finalPrice)}
                              </span>
                              {+product.discountValue > 0 && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  {formatPrice(product.salePrice)}
                                </span>
                              )}
                              {+product.discountValue > 0 && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {product.discountStrategy === "Percentage"
                                    ? `-${product.discountValue}%`
                                    : `Save ${formatPrice(product.discountValue)}`}
                                </span>
                              )}
                            </div>

                            {product.category?.name && (
                              <span className="text-[10px] text-gray-400 font-medium truncate block mt-0.5">
                                in {product.category.name}
                              </span>
                            )}
                          </div>

                          {/* Arrow */}
                          <div className="pr-1 text-gray-300 group-hover:text-global-primary group-hover:translate-x-1 transition-all">
                            <ArrowRightOutlined className="text-xs" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="p-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-xl">
                      <SearchOutlined />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        No results found for &ldquo;{query}&rdquo;
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                        Check for typos or try searching with more general keywords.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-xs font-bold text-global-primary hover:underline uppercase tracking-wider pt-1"
                    >
                      Clear search
                    </button>
                  </div>
                )}

                {/* View All Results Button */}
                {results.length > 0 && (
                  <div className="p-2.5 bg-gray-50 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-global-primary hover:bg-global-hover text-white flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
                    >
                      <span>View All Results for &ldquo;{query}&rdquo;</span>
                      <ArrowRightOutlined className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
