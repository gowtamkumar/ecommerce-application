"use client";
import { Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectGlobal,
  setAction,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { addCart } from "@/redux/features/cart/cartSlice";
import { productDiscountCalculation } from "@/lib/utils";
import { deleteWishlist, getUserWishlists } from "@/lib/apis/wishlist";
import { useEffect, useState } from "react";
import Card from "@/components/Card";

export default function MyWishlist() {
  const [wishlists, setWishlists] = useState([]);
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const wishlistRes = await getUserWishlists();
      console.log("wishlistRes", wishlistRes);

      setWishlists(wishlistRes.data);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  async function addToCart(value: any) {
    console.log("value", value);

    const price = +value.selectProductVariant.unitPrice;
    let taxAmount = (+price * (value?.tax?.value || 0)) / 100;
    dispatch(
      addCart({
        ...value,
        discountA: productDiscountCalculation(value) || 0,
        tax: taxAmount,
        price,
        qty: 1,
      })
    );
  }

  const handleDelete = async (id: string) => {
    try {
      dispatch(setLoading({ delete: true }));
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
        wishlists.map((item) => {
          return <Card item={item} />;
        })
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
}
