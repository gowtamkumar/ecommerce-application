"use client";
import React, { useState } from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const { Title, Text } = Typography;

const AddSize = dynamic(() => import("@/components/dashboard/size/AddSize"), {
  ssr: false,
});

const SizeList = dynamic(() => import("@/components/dashboard/size/SizeList"), {
  ssr: false,
});

export default function Size() {
  const [tabKey, setTabKey] = useState("size_list");
  const dispatch = useDispatch();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Product Sizes
          </Title>
          <Text type="secondary">
            Manage available product sizes
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                size: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Size
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <SizeList />
      </Card>

      <AddSize />
    </div>
  );
}
