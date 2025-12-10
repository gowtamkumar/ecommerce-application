"use client";
import React, { useState } from "react";
import { Button, Card, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { setAction } from "@/redux/features/global/globalSlice";
import dynamic from "next/dynamic";

const { Title, Text } = Typography;

const AddBanner = dynamic(() => import('@/components/dashboard/banner/AddBanner'), { ssr: false })
const BannerList = dynamic(() => import('@/components/dashboard/banner/BannerList'), { ssr: false })

export default function Banner() {
  const [tabKey, setTabKey] = useState("banner_list");
  const dispatch = useDispatch();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Banners & Sliders
          </Title>
          <Text type="secondary">
            Manage homepage banners and promotional sliders
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                banner: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Banner
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <BannerList />
      </Card>

      <AddBanner />
    </div>
  );
}
