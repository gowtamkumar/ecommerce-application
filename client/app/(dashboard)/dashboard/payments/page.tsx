"use client";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import PaymentList from "@/components/dashboard/payment/PaymentList";
import AddPayment from "@/components/dashboard/payment/AddPayment";

export default function Payment() {
  const [tabKey, setTabKey] = useState("payment");
  const dispatch = useDispatch();

  return (
    <div className="container bg-white p-3  ">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Payments",
            key: "payment",
            children: <PaymentList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() =>
              dispatch(
                setAction({
                  payment:true,
                  type: ActionType.CREATE,
                })
              )
            }
          >
            <PlusOutlined className="mx-1" /> New Payment
          </Button>
        }
      />
      <AddPayment />
    </div>
  );
}
