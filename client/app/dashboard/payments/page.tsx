"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Button, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const PaymentList = dynamic(
  () => import("@/components/dashboard/payment/PaymentList"),
  { ssr: false }
);

export default function Payment() {
  const [tabKey, setTabKey] = useState("payment");
  const route = useRouter();

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
            onClick={() => {
              route.push("/dashboard/payments/new");
            }}
          >
            <PlusOutlined className="mx-1" /> New Payment
          </Button>
        }
      />
    </div>
  );
}
