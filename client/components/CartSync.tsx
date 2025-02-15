/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { replaceCart } from "@/redux/features/cart/cartSlice";
import { fetchCartData } from "@/lib/utils/cart";

const CartSync = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user?.access_token) {
      fetchCartData(session.user.access_token).then((cartItems: any) => {
        dispatch(replaceCart(cartItems)); // ✅ Sync cart with Redux
      });
    }
  }, [session]);

  return null; // No UI needed
};

export default CartSync;
