"use client";
import AddToCartButton from "@/components/share-component/AddToCartButton";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteWishlist, getUserWishlists } from "@/lib/apis/wishlist";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
  selectGlobal,
  setAction
} from "@/redux/features/global/globalSlice";
import {
  DeleteOutlined,
  HeartFilled,
  ShoppingOutlined
} from "@ant-design/icons";
import {
  Button,
  Tooltip,
  Typography,
  message
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

export default function MyWishlist() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchData();
  }, [dispatch, global.action]);

  const fetchData = async () => {
    try {
      const wishlistRes = await getUserWishlists();
      setWishlists(wishlistRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      // Small delay to prevent flickering if response is too fast, and to show off the skeleton
      setTimeout(() => setLoading(false), 300);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteWishlist(id);
      if (res.success) {
        message.success("Item removed from wishlist");
        dispatch(setAction({ wishlist: true }));
        fetchData();
      }
    } catch (error: any) {
      console.log("Error deleting wishlist item:", error);
      message.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 space-y-3">
              <div className="aspect-[4/5] bg-gray-100 rounded-xl animate-pulse" />
              <div className="space-y-2 px-1">
                <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && !wishlists.length) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6">
          <HeartFilled />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 max-w-md mb-8">
          Seems like you haven't found anything yet. Browse our products and find something you love!
        </p>
        <Link href="/products">
          <Button type="primary" size="large" icon={<ShoppingOutlined />} className="h-12 px-8 text-base">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-500 mt-1">{wishlists.length} items saved for later</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlists.map((item: any) => {
          const images = getImageUrl(item?.thumbnailImage);
          const hasDiscount = item.discount > 0;
          const discountedPrice = item.price - (item.price * (item.discount || 0)) / 100;

          return (
            <div
              key={item.wishlistId || item._id}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                <Link href={`/product/${item?.slug}`} className="block w-full h-full">
                  <Image
                    src={images}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>

                {/* Badges */}
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    -{item.discount}%
                  </div>
                )}

                {/* Remove Button - Visible on Hover (Desktop) / Always (Mobile) */}
                <div className="absolute top-3 right-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  <Tooltip title="Remove from Wishlist">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(item.wishlistId || item._id);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm transition-colors"
                    >
                      <DeleteOutlined />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <Link href={`/product/${item.slug}`} className="block">
                  <h3 className="text-gray-900 font-medium leading-snug line-clamp-2 mb-2 hover:text-blue-600 transition-colors h-10">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-600 text-xs font-medium">
                    <span className="mr-1">★</span>{item.rating || 0}
                  </div>
                  <span className="text-xs text-gray-400">({item.reviews?.length || 0} reviews)</span>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(item.finalPrice)}
                    </span>
                    {item?.discountId && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.salePrice)}
                      </span>
                    )}
                  </div>

                </div>
                <AddToCartButton item={item} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
