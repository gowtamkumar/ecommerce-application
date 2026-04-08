"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { selectCart } from "@/redux/features/cart/cartSlice";
import {
  selectGlobal,
  setDrawarCart,
  setLoading,
} from "@/redux/features/global/globalSlice";
import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { FaBagShopping } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import ViewCart from "../website/header/ViewCart";

const ScrollToCart: React.FC = () => {
  const cart = useSelector(selectCart);
  const [mounted, setMounted] = useState(false);
  const { formatPrice } = useCurrency();

  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart?.carts?.cartSummary?.totalQty) {
      setMounted(false);
    } else {
      setMounted(true);
    }
  }, [cart?.carts?.cartSummary?.totalQty]);

  if (!mounted) return null; // 👈 important! don't render until mounted

  const showLoading = () => {
    dispatch(setDrawarCart(true));
    dispatch(setLoading({ drawerLoading: true }));
    setTimeout(() => {
      dispatch(setLoading({}));
    }, 2000);
  };

  const cartCount = cart?.carts?.cartSummary?.totalQty || 0;

  return (
    <>
      <button
        className="fixed bottom-1/2 right-1 z-50 cursor-pointer p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center gap-2"
        aria-label="Scroll to Cart"
        onClick={showLoading}
      >
        <div className="flex flex-col gap-1 rounded-sm items-center justify-center text-black bg-gray-200 ">
          <FaBagShopping color="black" size={20} className="mt-1" />
          <span className="text-sm">
            {cart?.carts?.cartSummary?.totalQty || 0} Items
          </span>
          <span className="text-sm bg-global-primary rounded-sm p-2">
            {formatPrice(cart?.carts?.cartSummary?.subTotal || 0)}
          </span>
        </div>

        {/* Cart Drawer */}
      </button>
      <Drawer
        closable
        title={
          <div className="flex items-center gap-2">
            <FiShoppingBag className="text-xl text-global-primary" />
            <span className="font-bold text-lg">Shopping Cart</span>
            {cartCount > 0 && (
              <span className="text-sm text-gray-500">({cartCount} items)</span>
            )}
          </div>
        }
        placement="right"
        open={global.drawarCart}
        loading={global.loading.drawerLoading}
        onClose={() => dispatch(setDrawarCart(false))}
        size={450}
        className="cart-drawer"
      >
        <ViewCart />
      </Drawer>
    </>
  );
};

export default ScrollToCart;
