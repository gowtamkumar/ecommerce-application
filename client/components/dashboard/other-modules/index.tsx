"use client";
import {
  BgColorsOutlined,
  ColumnWidthOutlined,
  DollarOutlined,
  GoldOutlined, PercentageOutlined,
  PictureOutlined,
  StarOutlined,
  TagsOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import { Space, Tabs, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Brand from "../brand/Brand";
import Currency from "../currency/Currency";

const { Title, Text } = Typography;

const Size = dynamic(() => import("@/app/dashboard/size/page"), {
  ssr: false,
});
const Unit = dynamic(() => import("@/app/dashboard/unit/page"), {
  ssr: false,
});
const Tax = dynamic(() => import("@/app/dashboard/taxs/page"), {
  ssr: false,
});
const Color = dynamic(() => import("@/app/dashboard/color/page"), {
  ssr: false,
});
const Banner = dynamic(() => import("@/app/dashboard/banner/page"), {
  ssr: false,
});
const Review = dynamic(() => import("@/app/dashboard/review/page"), {
  ssr: false,
});
const Lead = dynamic(() => import("./lead/Lead"), { ssr: false });

export default function Index() {
  const [tabKey, setTabKey] = useState<any>("sizes");
  const route = useRouter();

  const search = useSearchParams();

  useEffect(() => {
    setTabKey(search.get("tab"));
  }, [search]);

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="!mb-1">
          Other Modules
        </Title>
        <Text type="secondary">
          Manage additional product attributes and settings
        </Text>
      </div>

      {/* Tabs */}
      <Tabs
        tabPlacement="top"
        defaultValue={tabKey}
        activeKey={tabKey}
        onChange={(key) => {
          setTabKey(key);
          route.push(`/dashboard/other-modules?tab=${key}`);
        }}
        type="card"
        className="modern-tabs"
        items={[
          {
            label: <Space className="font-medium text-sm"><ColumnWidthOutlined /> Sizes</Space>,
            key: "sizes",
            children: <Size />,
          },
          {
            label: <Space className="font-medium text-sm"><GoldOutlined /> Units</Space>,
            key: "units",
            children: <Unit />,
          },
          {
            label: <Space className="font-medium text-sm"><PercentageOutlined /> Taxs</Space>,
            key: "taxs",
            children: <Tax />,
          },
          {
            label: <Space className="font-medium text-sm"><BgColorsOutlined /> Colors</Space>,
            key: "colors",
            children: <Color />,
          },
          {
            label: <Space className="font-medium text-sm"><PictureOutlined /> Banner</Space>,
            key: "banners",
            children: <Banner />,
          },
          {
            label: <Space className="font-medium text-sm"><TagsOutlined /> Brands</Space>,
            key: "brand",
            children: <Brand />,
          },
          {
            label: <Space className="font-medium text-sm"><StarOutlined /> Reviews</Space>,
            key: "reviews",
            children: <Review />,
          },
          {
            label: <Space className="font-medium text-sm"><UsergroupAddOutlined /> Leads</Space>,
            key: "leads",
            children: <Lead />,
          },
          {
            label: <Space className="font-medium text-sm"><DollarOutlined /> Currencies</Space>,
            key: "currencies",
            children: <Currency />,
          },
        ]}
      />
    </div>
  );
}
