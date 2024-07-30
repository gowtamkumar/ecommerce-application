"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import AddShippingCharge from "@/components/dashboard/shipping-charge/AddShippingCharge";
import ShippingChargeList from "@/components/dashboard/shipping-charge/ShippingChargeList";

export default function ShippingCharge() {
  const [tabKey, setTabKey] = useState("shipping_charge_list");
  const dispatch = useDispatch();


  return (
    <div className="container bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Shipping Charge List",
            key: "shipping_charge_list",
            children: <ShippingChargeList />,
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
            <PlusOutlined className="mx-1" /> New charge
          </Button>
        }
      />
      <AddShippingCharge />
    </div>
  );
}
