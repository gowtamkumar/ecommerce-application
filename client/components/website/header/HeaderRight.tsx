"use client";
import { userProfileRoute } from "@/NavBarRoute";
import { Avatar, Badge, Drawer, Dropdown, Modal } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiSearch, CiHeart } from "react-icons/ci";
import appConfig from "@/appConfig";
import ViewCart from "./ViewCart";
import { FiShoppingBag } from "react-icons/fi";
import dynamic from "next/dynamic";
import { selectCart } from "@/redux/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import { selectLayout, setOpen } from "@/redux/features/layout/layoutSlice";

const HeaderSearch = dynamic(() => import("./HeaderSearch"));

export default function HeaderRight() {
  const [drawarCart, setDrawarCart] = useState(false);
  const [mounted, setMounted] = useState(false);
  // hook
  const cart = useSelector(selectCart);
  const global = useSelector(selectGlobal);
  const layout = useSelector(selectLayout);
  const dispatch = useDispatch();
  const session = useSession();

  const profileImage = session.data?.user?.image;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 👈 important! don't render until mounted

  const showLoading = () => {
    setDrawarCart(true);
    dispatch(setLoading({ drawerLoading: true }));
    // Simple loading mock. You should add cleanup logic in real world.
    setTimeout(() => {
      dispatch(setLoading({}));
    }, 2000);
  };

  return (
    <div className="flex md:gap-4 gap-1 justify-between items-center order-3 px-2">
      <CiSearch
        size={22}
        className="font-medium cursor-pointer "
        onClick={() => dispatch(setOpen(true))}
      />
      <Link
        href="/profile?tab=wishlist"
        className="cursor-pointer md:inline hidden"
      >
        <CiHeart size={22} className="font-medium" />
      </Link>

      <div className="relative group">
        <Badge
          size="default"
          count={cart?.carts?.cartSummary?.totalQty}
          onClick={showLoading}
          className="px-4  font-semibold text-white rounded-md cursor-pointer"
        >
          <FiShoppingBag size={22} className="font-medium" />
        </Badge>

        <Drawer
          closable
          destroyOnClose
          title={<p>Carts</p>}
          placement="right"
          open={drawarCart}
          loading={global.loading.drawerLoading}
          onClose={() => setDrawarCart(false)}
          width={450}
        >
          <ViewCart />
        </Drawer>
      </div>

      {session.status === "authenticated" ? (
        <Dropdown
          menu={{ items: userProfileRoute as any }}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <Avatar
            className="cursor-pointer h-10 w-10 rounded-full bg-slate-500"
            size={25}
            src={
              profileImage
                ? `${appConfig.baseApiUrl}/uploads/${profileImage}`
                : "/pos_software.png"
            }
          />
        </Dropdown>
      ) : (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center justify-between">
            <Link className="mx-2" href="/login">
              <span className="text-sm">Login</span>
            </Link>{" "}
            |{" "}
            <Link className="mx-2" href="/register">
              <span className="text-sm">Sign up</span>
            </Link>
          </div>
        </div>
      )}

      <Modal
        open={layout.open}
        onCancel={() => dispatch(setOpen(false))}
        width={1000}
        footer={null}
      >
        <HeaderSearch />
      </Modal>
    </div>
  );
}
