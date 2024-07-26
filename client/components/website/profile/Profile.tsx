"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
import UserOrders from "@/components/website/profile/UserOrders";
import MyAccount from "@/components/website/profile/MyAccount";
import { getMe } from "@/lib/apis/user";
import MyWishlist from "@/components/website/profile/MyWishlist";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setLoading } from "@/redux/features/global/globalSlice";
import ShippingAddressList from "@/components/dashboard/shipping-address/ShippingAddresslist";

export default function Profile() {
  const [user, setUser] = useState({});
  // hook
  const global = useSelector(selectGlobal);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setLoading({ loading: true }));
      const res = await getMe();
      setUser(res.data);
      dispatch(setLoading({ loading: false }));
    })();
  }, [dispatch, global.action]);

  return (
    <div>
      <Tabs
        tabPosition="left"
        defaultActiveKey="1"
        items={[
          {
            label: `My Account`,
            children: <MyAccount user={user} />,
            icon: <AppleOutlined />,
          },

          {
            label: `Orders`,
            children: <UserOrders />,
            icon: <AndroidOutlined />,
          },
          {
            label: `Wishlist`,
            children: <MyWishlist user={user} />,
            icon: <AndroidOutlined />,
          },

          // {
          //   label: `Shipping Address`,
          //   children: <ShippingAddressList />,
          //   icon: <AndroidOutlined />,
          // },

          {
            label: `My Returns & Cancellations`,
            children: `My Returns & Cancellations`,
            icon: <AndroidOutlined />,
          },

          {
            label: `My Point`,
            children: `My Point`,
            icon: <AndroidOutlined />,
          },
        ].map((item: any, i) => {
          const id = String(i + 1);
          // console.log("dd", item);

          return {
            key: id,
            label: item.label,
            children: item.children,
            icon: item.icon,
          };
        })}
      />
    </div>
  );
}
