"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { selectGlobal, setAction } from "@/redux/features/global/globalSlice";

const { Title, Text } = Typography;

const ColorList = dynamic(
  () => import("@/components/dashboard/color/ColorList"),
  { ssr: false }
);
const AddColor = dynamic(
  () => import("@/components/dashboard/color/AddColor"),
  { ssr: false }
);

export default function Color() {
  const [tabKey, setTabKey] = useState("Color_list");
  const dispatch = useDispatch();
  const global = useSelector(selectGlobal);
  const { action } = global;
  
  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Product Colors
          </Title>
          <Text type="secondary">
            Manage color options for products
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                color: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Color
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <ColorList />
      </Card>

      <AddColor />
    </div>
  );
}
