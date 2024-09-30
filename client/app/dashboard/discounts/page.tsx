"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import DiscountList from "@/components/dashboard/discount/DiscountList";
import AddDiscount from "@/components/dashboard/discount/AddDiscount";

export default function Discount() {
  const [tabKey, setTabKey] = useState("discount_list");
  const dispatch = useDispatch();

  return (
    <div className="container-fluid bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Discounts",
            key: "discount_list",
            children: <DiscountList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  discount:true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Discount
          </Button>
        }
      />
      <AddDiscount />
    </div>
  );
}
