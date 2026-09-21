"use client";

import AddToCartButton from "@/components/share-component/AddToCartButton";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteWishlist, getUserWishlists } from "@/lib/apis/wishlist";
import { getProductImageUrls } from "@/lib/utils/imageUrl";
import {
    errorNotification,
    successNotification,
} from "@/lib/utils/notification";
import {
    selectGlobal,
    setAction,
} from "@/redux/features/global/globalSlice";
import { Input, Pagination, Rate, Select, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    FiArrowRight,
    FiHeart,
    FiSearch,
    FiShoppingBag,
    FiTrash2
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  thumbnailImage?: string;
  hoverImage?: string;
  discountId?: string;
  discountStrategy?: string;
  discountValue?: number;
  featured?: boolean;
  wishlistId?: string;
  unitPrice?: number;
  salePrice?: number;
  finalPrice: number;
  stockQty?: number;
  reviewsCount?: number;
  avgRating?: number;
  brand?: {
    name?: string;
  };
}

export default function MyWishlist() {
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { formatPrice, selectedCurrency } = useCurrency();

  const fetchData = async () => {
    try {
      const wishlistRes = await getUserWishlists();
      setWishlists(wishlistRes.data || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      errorNotification({ message: "Failed to load wishlist items" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, global.action]);

  const handleDelete = async (e: React.MouseEvent, item: WishlistItem) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = item.wishlistId || item.id;
    if (!targetId) return;

    try {
      setDeletingId(targetId);
      const res = await deleteWishlist(targetId);
      if (res.success) {
        successNotification({ message: "Item removed from wishlist" });
        dispatch(setAction({ wishlist: true }));
        setWishlists((prev) =>
          prev.filter((w) => (w.wishlistId || w.id) !== targetId)
        );
      } else {
        errorNotification({
          message: res.message || "Failed to remove item",
        });
      }
    } catch (error: any) {
      console.error("Error deleting wishlist item:", error);
      errorNotification({ message: "Failed to remove item from wishlist" });
    } finally {
      setDeletingId(null);
    }
  };

  // Filter & Sort
  const filteredAndSortedItems = useMemo(() => {
    let result = [...wishlists];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.brand?.name?.toLowerCase().includes(q)
      );
    }

    // In-Stock only filter
    if (inStockOnly) {
      result = result.filter(
        (item) => item.stockQty === undefined || item.stockQty > 0
      );
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => Number(a.finalPrice || 0) - Number(b.finalPrice || 0));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => Number(b.finalPrice || 0) - Number(a.finalPrice || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => Number(b.avgRating || 0) - Number(a.avgRating || 0));
    }

    return result;
  }, [wishlists, searchQuery, inStockOnly, sortBy]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedItems.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedItems, currentPage, pageSize]);

  // Reset page when filters change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleToggleInStock = () => {
    setInStockOnly((prev) => !prev);
    setCurrentPage(1);
  };

  // ── Skeleton Loader ──
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-gray-100 rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-full sm:w-64 bg-gray-100 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3.5 border border-gray-100 space-y-3 shadow-xs"
            >
              <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              <div className="space-y-2 pt-1">
                <div className="h-4 bg-gray-100 rounded-md w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded-md w-1/2 animate-pulse" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-20 bg-gray-100 rounded-md animate-pulse" />
                  <div className="h-4 w-12 bg-gray-100 rounded-md animate-pulse" />
                </div>
                <div className="h-10 bg-gray-100 rounded-xl w-full animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty State ──
  if (!loading && !wishlists.length) {
    return (
      <div className="min-h-[440px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-xs text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-inner">
          <FiHeart className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-1.5 tracking-tight">
          Your Wishlist is Empty
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
          Explore our collection, discover items you love, and tap the heart
          icon to save them for later!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-global-primary text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-amber-200/60 hover:opacity-95 transition-opacity"
        >
          <FiShoppingBag className="w-4 h-4" />
          <span>Explore Products</span>
          <FiArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header Title & Controls ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              My Saved Items
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-800 border border-amber-200/80">
              {wishlists.length} {wishlists.length === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Monitor price drops, compare saved favorites, and quickly move items into your cart.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Search */}
          <div className="w-full sm:w-56">
            <Input
              prefix={<FiSearch className="text-gray-400 mr-1" />}
              placeholder="Search wishlist..."
              allowClear
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="rounded-xl h-10 text-xs border-gray-200 hover:border-global-primary focus:border-global-primary"
            />
          </div>

          {/* Sort Selector */}
          <Select
            value={sortBy}
            onChange={handleSortChange}
            className="w-40 sm:w-44 h-10 [&_.ant-select-selector]:rounded-xl! text-xs font-semibold"
            options={[
              { value: "recent", label: "Recently Added" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "rating", label: "Highest Rated" },
            ]}
          />

          {/* In-Stock Toggle */}
          <button
            onClick={handleToggleInStock}
            className={`inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              inStockOnly
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                inStockOnly ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
            <span>In Stock</span>
          </button>
        </div>
      </div>

      {/* ── No Search / Filter Results ── */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="p-10 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
          <FiHeart className="mx-auto text-3xl text-gray-300 mb-2" />
          <p className="text-sm font-bold text-gray-800 mb-1">
            No matching saved items
          </p>
          <p className="text-xs text-gray-400 mb-4">
            No wishlist items match your active search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setInStockOnly(false);
              setSortBy("recent");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-global-primary font-bold text-xs rounded-xl border border-amber-300 shadow-2xs hover:bg-amber-50 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* ── Product Grid ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedItems.map((item) => {
            const { thumbnailUrl, hoverUrl } = getProductImageUrls(
              item.thumbnailImage,
              item.hoverImage
            );

            const discountVal = Number(item.discountValue || 0);
            const isOutOfStock =
              item.stockQty !== undefined && item.stockQty <= 0;
            const isDeleting =
              deletingId === (item.wishlistId || item.id);

            const savings =
              item.salePrice && Number(item.salePrice) > Number(item.finalPrice)
                ? Number(item.salePrice) - Number(item.finalPrice)
                : 0;

            return (
              <div
                key={item.wishlistId || item.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full shadow-xs"
              >
                {/* ── Image Container ── */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  <Link
                    href={`/products/${item.slug}`}
                    className="block w-full h-full"
                  >
                    <Image
                      src={thumbnailUrl}
                      alt={item.name}
                      fill
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
                        isOutOfStock ? "opacity-50 grayscale-[20%]" : ""
                      }`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {hoverUrl && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
                        <Image
                          src={hoverUrl}
                          alt={item.name}
                          fill
                          className={`object-cover ${
                            isOutOfStock ? "opacity-50 grayscale-[20%]" : ""
                          }`}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    )}

                    {/* Gradient shadow for contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </Link>

                  {/* Discount / Stock Badges */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
                    {discountVal > 0 && (
                      <span className="bg-rose-600 text-white px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wide shadow-sm">
                        -{item.discountValue}
                        {item.discountStrategy === "Percentage"
                          ? "%"
                          : selectedCurrency?.symbol}{" "}
                        OFF
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="bg-gray-900/90 text-white px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-sm backdrop-blur-xs">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Tooltip title="Remove from Wishlist">
                    <button
                      onClick={(e) => handleDelete(e, item)}
                      disabled={isDeleting}
                      aria-label="Remove from Wishlist"
                      className="absolute top-2.5 right-2.5 z-20 w-8 h-8 bg-white/95 backdrop-blur-xs rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-400 hover:text-rose-600 hover:scale-110 transition-all cursor-pointer"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </Tooltip>
                </div>

                {/* ── Product Info ── */}
                <div className="p-3.5 sm:p-4 flex flex-col flex-1 gap-2 bg-white">
                  {/* Brand tag if available */}
                  {item.brand?.name && (
                    <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full truncate max-w-[120px]">
                      {item.brand.name}
                    </span>
                  )}

                  {/* Title */}
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-global-primary transition-colors line-clamp-2 min-h-[2.5rem] leading-snug">
                    <Link href={`/products/${item.slug}`}>{item.name}</Link>
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <Rate
                      disabled
                      value={Number(item.avgRating) || 0}
                      className="text-[11px] text-amber-400"
                    />
                    <span className="text-[10px] font-medium text-gray-400 leading-none">
                      ({item.reviewsCount || 0})
                    </span>
                  </div>

                  {/* Price Row & Savings */}
                  <div className="flex items-baseline gap-2 flex-wrap mt-auto pt-1">
                    <span className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                      {formatPrice(item.finalPrice)}
                    </span>
                    {discountVal > 0 && item.salePrice && (
                      <span className="text-[11px] text-gray-400 line-through font-medium">
                        {formatPrice(item.salePrice)}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        Save {formatPrice(savings)}
                      </span>
                    )}
                  </div>

                  {/* Add To Cart */}
                  <div className="pt-1.5">
                    <AddToCartButton
                      item={{ ...item, qty: 1 }}
                      className="h-9 sm:h-10 rounded-xl text-[11px] sm:text-xs font-bold tracking-wide"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination Bar ── */}
      {filteredAndSortedItems.length > pageSize && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filteredAndSortedItems.length)} of{" "}
            {filteredAndSortedItems.length} items
          </p>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredAndSortedItems.length}
            onChange={(page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }}
            showSizeChanger
            pageSizeOptions={["8", "16", "32", "48"]}
            size="small"
          />
        </div>
      )}
    </div>
  );
}
