"use client";
import AddToCartButton from "@/components/AddToCartButton";
import { useCurrency } from "@/context/CurrencyContext";
import { deleteWishlist, getUserWishlists } from "@/lib/apis/wishlist";
import { getImageUrl } from "@/lib/utils/imageUrl";
import {
  selectGlobal,
  setAction
} from "@/redux/features/global/globalSlice";
import {
  DeleteOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Rate,
  Tooltip,
  Typography
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
    setLoading(true);
    try {
      const wishlistRes = await getUserWishlists();
      setWishlists(wishlistRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Optimistic update or waiting for reload
      const res = await deleteWishlist(id);
      if (res.success) {
        dispatch(setAction({ wishlist: true })); // Trigger reload via global action if needed, or just recall fetch
        fetchData();
      }
    } catch (error: any) {
      console.log("Error deleting wishlist item:", error);
    }
  };

  if (loading && !wishlists.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} loading variant="borderless" className="shadow-sm" />
        ))}
      </div>
    );
  }

  if (!loading && !wishlists.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="text-center">
              <Title level={4}>Your wishlist is empty</Title>
              <Text type="secondary">Explore more and shortlist some items.</Text>
            </div>
          }
        />
        <Link href="/products" className="mt-4">
          <Button type="primary" size="large">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Title level={3} className="!mb-0">My Wishlist</Title>
        <Text type="secondary">{wishlists.length} items saved for later</Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlists.map((item: any) => {
          console.log(item);

          const images = getImageUrl(item?.thumbnailImage);

          return (
            <div
              key={item.wishlistId || item._id}
              className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Delete Action - Top Right */}
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip title="Remove">
                  <Button
                    type="text"
                    danger
                    shape="circle"
                    className="bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(item.wishlistId || item._id);
                    }}
                  />
                </Tooltip>
              </div>

              {/* Image Area */}
              <Link href={`/product/${item?.slug}`} className="relative aspect-[4/5] bg-gray-50 block overflow-hidden">
                <Image
                  src={images}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {item.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{item.discount}%
                  </span>
                )}
              </Link>

              {/* Content Area */}
              <div className="p-4 flex flex-col flex-1">
                <Link href={`/product/${item.slug}`} className="block">
                  <h3 className="text-gray-800 font-medium line-clamp-2 mb-1 hover:text-blue-600 transition-colors h-12">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <Rate disabled defaultValue={item.rating || 0} className="text-xs !text-yellow-400" />
                  <span className="text-xs text-gray-400">({item.reviews?.length || 0})</span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price - (item.price * (item.discount || 0)) / 100)}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  <AddToCartButton item={item} className="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
