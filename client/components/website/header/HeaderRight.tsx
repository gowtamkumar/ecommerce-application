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
        <div className="relative w-10 h-10 flex items-center justify-center rounded-global-button-radius 
                     bg-global-button-primary text-global-button-text
                     transition-all duration-300 shadow-md hover:shadow-lg hover:bg-global-button-hover
                     hover:scale-105">
          <CiHeart
            size={22}
            className="transition-all duration-300"
          />

          {/* Tooltip */}
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 
                         text-[10px] font-medium px-2 py-1 rounded
                         opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                         pointer-events-none z-50 bg-global-button-primary text-global-button-text shadow-xl">
            Wishlist
          </span>
        </div>
      </Link>


      {/* Shopping Cart Icon */}
      <div className="relative group">
        <div
          onClick={showLoading}
          className="group cursor-pointer relative w-10 h-10 flex items-center justify-center 
                   rounded-global-button-radius bg-global-button-primary text-global-button-text
                   transition-all duration-300 shadow-md hover:shadow-lg hover:bg-global-button-hover
                   hover:scale-105"
        >
          <FiShoppingBag
            size={20}
            className="transition-all duration-300"
            style={{ color: "inherit" }}
          />

          {/* Cart Badge */}
          {cartCount > 0 && (
            <div className="absolute -top-1.5 -right-1.5 text-global-button-primary text-[10px] font-bold min-w-[18px] h-[18px] 
                           flex items-center justify-center rounded-full
                           shadow-md animate-pulse bg-global-button-text border border-global-button-primary">
              {cartCount > 99 ? '99+' : cartCount}
            </div>
          )}

          {/* Tooltip */}
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 
                         text-[10px] font-medium px-2 py-1 rounded
                         opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                         pointer-events-none z-50 bg-global-button-primary text-global-button-text shadow-xl">
            Shopping Cart
          </span>
        </div>

        {/* Cart Drawer */}
        <Drawer
          closable
          title={
            <div className="flex items-center gap-2">
              <FiShoppingBag className="text-xl text-global-primary " />
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
            overlayClassName="pt-2 profile-dropdown-overlay"
          >
            <div className="cursor-pointer group relative">
              <div className="w-10 h-10 flex items-center justify-center rounded-global-button-radius 
                           bg-global-button-primary p-0.5 border border-white/20
                           transition-all duration-300 shadow-md hover:shadow-lg 
                           hover:bg-global-button-hover hover:scale-105 overflow-hidden">
                <Avatar
                  size={32}
                  src={getUploadImageUrl(profileImage)}
                  className="transition-transform duration-300"
                  style={{ background: "linear-gradient(to bottom right, var(--button-primary-color), var(--button-hover-color))" }}
                />
              </div>

              {/* Online Indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                           border-2 border-white rounded-full shadow-sm"
                    style={{ backgroundColor: "#10b981" }}></span>

              {/* Tooltip */}
              <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 
                           text-[10px] font-medium px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                           pointer-events-none z-50 bg-global-button-primary text-global-button-text shadow-xl">
                My Account
              </span>
            </div>
          </Dropdown>
        </>
      )}
    </div>
  );
}
