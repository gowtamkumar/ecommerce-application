"use client";
import CouponDetails from "@/components/dashboard/coupon/CouponDetails";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CouponList = dynamic(
  () => import("@/components/dashboard/coupon/CouponList"),
  { ssr: false }
);

export default function Page() {
  const [tabKey, setTabKey] = useState("coupon_list");
  const route = useRouter();

  return (
    <div className="container bg-white p-3">
      <Tabs
        activeKey={tabKey}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: "Coupon List",
            key: "coupon_list",
            children: <CouponList />,
          },
        ]}
        tabBarExtraContent={
          <Button
            size="small"
            className="capitalize"
            onClick={() => route.push("/dashboard/coupons/new")}
          >
            <PlusOutlined className="mx-1" /> New Coupon
          </Button>
        }
      />
      <CouponDetails />
    </div>
  );
}
