"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import AddWishlists from "@/components/dashboard/wishlists/AddWishlists";
import WishlistsList from "@/components/dashboard/wishlists/WishlistsList";


export default function Wishlists() {
  const [tabKey, setTabKey] = useState("wishlists_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Wishlists",
            key: "wishlists_list",
            children: <WishlistsList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Wishlists
          </Button>
        }
      />
      <AddWishlists />
    </div>
  );
}
