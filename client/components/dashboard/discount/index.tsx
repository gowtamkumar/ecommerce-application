"use client";
import DiscountDetails from "@/components/dashboard/discount/DiscountDetails";
import DiscountStatusUpdate from "@/components/dashboard/discount/DiscountStatusUpdate";
import { ActionType } from "@/constants/constants";
import { selectGlobal } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const DiscountList = dynamic(
  () => import("@/components/dashboard/discount/DiscountList")
);

export default function Discount() {
  const [tabKey, setTabKey] = useState("discount_list");
  const route = useRouter();
  const global = useSelector(selectGlobal);

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={2} className="!mb-1">
            Discounts & Promotions
          </Title>
          <Text type="secondary">
            Manage discount campaigns, offers, and promotional deals
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => route.push("/dashboard/discounts/new")}
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Discount
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <DiscountList />
      </Card>

      {global.action.type === ActionType.VIEW && <DiscountDetails />}
      {global.action.type === ActionType.UPDATE && <DiscountStatusUpdate />}
    </div>
  );
}
