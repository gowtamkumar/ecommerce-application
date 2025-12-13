"use client";
import Card from "@/components/Card";
import { deleteWishlist, getUserWishlists } from "@/lib/apis/wishlist";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Button, Empty } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MyWishlist() {
  const [wishlists, setWishlists] = useState([]);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    (async () => {
      const wishlistRes = await getUserWishlists();
      setWishlists(wishlistRes.data);
    })();
  }, [dispatch, global.action]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: id }));
      const res = await deleteWishlist(id);
      setTimeout(async () => {
        dispatch(setLoading({ delete: false }));
        dispatch(setAction({}));
      }, 500);
    } catch (error: any) {
      console.log("v", error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {wishlists?.length ? (
        wishlists.map((item: any) => {
          const id = item.wishlistId;
          return (
            <div className="py-12" key={id}>
              <Card item={item} />
              <div className="mt-2">
                <Button
                  danger
                  className="w-full "
                  loading={global.loading.delete === id}
                  onClick={() => handleDelete(id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
