"use client";
import AddShippingAddress from "@/components/dashboard/shipping-address/AddShippingAddress";
import ShippingAddressList from "@/components/dashboard/shipping-address/ShippingAddressList";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { Button, Tabs } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
export default function Page() {
  const [tabKey, setTabKey] = useState("shipping_address_list");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Shipping Address List",
            key: "shipping_address_list",
            children: <ShippingAddressList />,
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
            <PlusOutlined className="mx-1" /> New Address
          </Button>
        }
      />
      <AddShippingAddress />
    </div>
  );
}
