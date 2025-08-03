"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";

const AddShippingCharge = dynamic(
  () => import("@/components/dashboard/shipping-charge/AddShippingCharge"),
  { ssr: false }
);
const ShippingChargeList = dynamic(
  () => import("@/components/dashboard/shipping-charge/ShippingChargeList"),
  { ssr: false }
);

export default function ShippingCharge() {
  const [tabKey, setTabKey] = useState("shipping_charge_list");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3">
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
            onClick={() =>
              dispatch(
                setAction({
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined /> New Shipping Charge
          </Button>
        }
      />
      <AddShippingCharge />
    </div>
  );
}
