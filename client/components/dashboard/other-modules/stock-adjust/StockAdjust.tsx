"use client";
import dynamic from 'next/dynamic'
import React, { useState } from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";

const { Title, Text } = Typography;

const AddStockAdjust = dynamic(()=> import('./AddStockAdjust'), {ssr: false})
const StockAdjustList = dynamic(()=> import('./StockAdjustList'), {ssr: false})

export default function StockAdjust() {
  const [tabKey, setTabKey] = useState("stock_adjust");
  const dispatch = useDispatch();

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <SyncOutlined className="text-2xl text-blue-600" />
          </div>
          <div>
            <Title level={2} className="!mb-0">
              Stock Adjustments
            </Title>
            <Text type="secondary" className="text-sm">
              Manage inventory adjustments for product variants
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                stockAdjust: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!h-10 !px-6 !font-medium"
          style={{ borderRadius: "var(--button-border-radius)" }}
        >
          New Stock Adjustment
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <StockAdjustList />
      </Card>

      <AddStockAdjust />
    </div>
  );
}
