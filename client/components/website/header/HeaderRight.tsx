"use client";
import { userProfileRoute } from "@/NavBarRoute";
import { Avatar, Badge, Drawer, Dropdown } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import appConfig from "@/appConfig";
import ViewCart from "./ViewCart";
import { FiShoppingBag } from "react-icons/fi";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";

export default function HeaderRight() {
  const [drawarCart, setDrawarCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();
  const session = useSession();
  const profileImage = session.data?.user?.image;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const showLoading = () => {
    setDrawarCart(true);
    dispatch(setLoading({ drawerLoading: true }));
    setTimeout(() => {
      dispatch(setLoading({}));
    }, 2000);
  };

  return (
    <div className="flex items-center gap-5">
      <Link
        href="/profile?tab=wishlist"
        className="cursor-pointer md:inline hidden group relative"
      >
        <CiHeart size={26} className="text-gray-700 group-hover:text-black transition-colors" />
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Wishlist</span>
      </Link>

      <div className="relative group">
        <div 
          onClick={showLoading}
          className="cursor-pointer relative"
        >
          <FiShoppingBag size={24} className="text-gray-700 group-hover:text-black transition-colors" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
            {cart?.carts?.cartSummary?.totalQty || 0}
          </span>
        </div>

        <Drawer
          closable
          destroyOnClose
          title={<p className="font-bold text-lg">Shopping Cart</p>}
          placement="right"
          open={drawarCart}
          loading={global.loading.drawerLoading}
          onClose={() => setDrawarCart(false)}
          width={450}
        >
          <ViewCart />
        </Drawer>
      </div>

      {session.status === "authenticated" && (
        <Dropdown
          menu={{ items: userProfileRoute as any }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="pt-2"
        >
          <div className="cursor-pointer border-2 border-transparent hover:border-gray-200 rounded-full transition-all">
            <Avatar
              size={32}
              src={
                profileImage
                  ? `${appConfig.baseApiUrl}/uploads/${profileImage}`
                  : "/pos_software.png"
              }
              className="bg-gray-200"
            />
          </div>
        </Dropdown>
      )}
    </div>
  );
}
