"use client";
import NotificationDropdown from "@/components/share-component/NotificationDropdown";
import { getUploadImageUrl } from "@/lib/utils/imageUrl";
import { userProfileRoute } from "@/NavBarRoute";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { selectGlobal, setDrawarCart, setLoading } from "@/redux/features/global/globalSlice";
import { Avatar, Drawer, Dropdown } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

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
    <div className="flex items-center gap-4">
      {/* Wishlist Icon */}
      <Link
        href="/profile?tab=wishlist"
        className="cursor-pointer md:inline hidden group relative"
      >
        <div className="relative p-2 rounded-full hover:bg-global-primary/10 transition-all duration-300">
          <CiHeart
            size={26}
            className="group-hover:text-global-primary transition-all duration-300 
                     group-hover:scale-110"
          />

          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                         text-[10px] font-medium px-2 py-1 rounded
                         opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                         pointer-events-none z-10"
                style={{ backgroundColor: "var(--global-primary)", color: "#ffffff" }}>
            Wishlist
          </span>
        </div>
      </Link>


      {/* Shopping Cart Icon */}
      <div className="relative group">
        <div
          onClick={showLoading}
          className="cursor-pointer relative p-2 rounded-full hover:bg-global-primary/10 transition-all duration-300"
        >
          <FiShoppingBag
            size={24}
            className="group-hover:text-global-primary transition-all duration-300
                     group-hover:scale-110"
          />

          {/* Cart Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-br from-global-primary to-global-hover 
                           text-white text-[10px] font-bold min-w-[18px] h-[18px] 
                           flex items-center justify-center rounded-full
                           shadow-md animate-pulse">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}

          {/* Tooltip */}
          <span
         
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                         text-[10px] font-medium px-2 py-1 rounded
                         opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                         pointer-events-none z-10"
                style={{ backgroundColor: "var(--global-primary)", color: "#ffffff" }}>
            Shopping Cart
          </span>
        </div>

        {/* Cart Drawer */}
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
          width={450}
          className="cart-drawer"
        >
          <ViewCart />
        </Drawer>
      </div>

      {/* User Profile */}
      {session.status === "authenticated" && (
        <>
          <NotificationDropdown />
          <Dropdown
            menu={{ items: userProfileRoute as any }}
            placement="bottomRight"
            trigger={["click"]}
            overlayClassName="pt-2"
          >
            <div className="cursor-pointer group relative">
              <div className="p-0.5 rounded-full border-2 border-transparent 
                          hover:border-global-primary/30 transition-all duration-300
                          hover:shadow-[0_0_12px_var(--global-primary)]">
                <Avatar
                  size={36}
                  src={getUploadImageUrl(profileImage)}
                  className="group-hover:scale-105 transition-transform duration-300"
                  style={{ background: "linear-gradient(to bottom right, var(--global-primary-light, #e5e7eb), var(--global-primary-lighter, #f3f4f6))" }}
                />
              </div>

              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3
                           border-2 border-white rounded-full"
                    style={{ backgroundColor: "#10b981" }}></span>

              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 
                           text-[10px] font-medium px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                           pointer-events-none z-10"
                    style={{ backgroundColor: "var(--global-primary)", color: "#ffffff" }}>
                My Account
              </span>
            </div>
          </Dropdown>
        </>
      )}
    </div>
  );
}
