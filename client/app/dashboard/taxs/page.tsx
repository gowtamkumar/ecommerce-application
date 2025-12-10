"use client";
import React, { useState } from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const { Title, Text } = Typography;

const TaxList = dynamic(() => import("@/components/dashboard/tax/Taxlist"), {
  ssr: false,
});

const AddTax = dynamic(() => import("@/components/dashboard/tax/AddTax"), {
  ssr: false,
});

export default function Tax() {
  const [tabKey, setTabKey] = useState("tax_list");
  const dispatch = useDispatch();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Tax Configuration
          </Title>
          <Text type="secondary">
            Manage tax rates for products
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                tax: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Tax
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <TaxList />
      </Card>

      <AddTax />
    </div>
  );
}
