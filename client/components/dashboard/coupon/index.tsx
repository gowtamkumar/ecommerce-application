"use client";
import CouponDetails from "@/components/dashboard/coupon/CouponDetails";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

const CouponList = dynamic(
  () => import("@/components/dashboard/coupon/CouponList"),
  { ssr: false }
);

export default function Coupon() {
  const [tabKey, setTabKey] = useState("coupon_list");
  const route = useRouter();

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={2} className="!mb-1">
            Coupons Management
          </Title>
          <Text type="secondary">
            Manage coupon codes and promotional discounts for customers
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => route.push("/dashboard/coupons/new")}
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Coupon
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <CouponList />
      </Card>

      <CouponDetails />
    </div>
  );
}
