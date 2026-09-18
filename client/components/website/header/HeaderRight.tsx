"use client";
import NotificationDropdown from "@/components/share-component/NotificationDropdown";
import ProfileDropdown from "@/components/share-component/ProfileDropdown";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { selectGlobal, setDrawarCart, setLoading } from "@/redux/features/global/globalSlice";
import { Drawer } from "antd";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

const ViewCart = dynamic(() => import("@/components/website/header/ViewCart"), {
  ssr: false,
});

export default function HeaderRight() {
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
    dispatch(setDrawarCart(true));
    dispatch(setLoading({ drawerLoading: true }));
    setTimeout(() => {
      dispatch(setLoading({}));
    }, 2000);
  };

  const cartCount = cart?.carts?.cartSummary?.totalQty || 0;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/profile?tab=wishlist"
        className="cursor-pointer md:inline hidden group relative"
        aria-label="Wishlist"
      >
        <div
          className="relative w-10 h-10 flex items-center justify-center rounded-full
                     border border-gray-200 bg-white text-gray-700
                     transition-colors duration-200 hover:border-global-primary hover:text-global-primary"
        >
          <CiHeart size={22} />
        </div>
      </Link>

      <div className="relative group">
        <button
          type="button"
          onClick={showLoading}
          aria-label="Shopping cart"
          className="relative w-10 h-10 flex items-center justify-center rounded-full
                   border border-gray-200 bg-white text-gray-700
                   transition-colors duration-200 hover:border-global-primary hover:text-global-primary"
        >
          <FiShoppingBag size={18} />

          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-global-primary text-white text-[10px] font-semibold min-w-[18px] h-[18px]
                           flex items-center justify-center rounded-full border-2 border-white"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>

        <Drawer
          closable
          title={
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-xl text-global-primary" />
              <span className="font-semibold text-lg">Shopping Cart</span>
              {cartCount > 0 && (
                <span className="text-sm text-gray-500">({cartCount} items)</span>
              )}
            </div>
          }
          placement="right"
          open={global.drawarCart}
          loading={global.loading.drawerLoading}
          onClose={() => dispatch(setDrawarCart(false))}
          size="default"
          className="cart-drawer"
        >
          <ViewCart />
        </Drawer>
      </div>

      {session.status === "authenticated" && (
        <>
          <NotificationDropdown />
          <ProfileDropdown profileImage={profileImage} />
        </>
      )}
    </div>
  );
}
