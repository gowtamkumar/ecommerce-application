"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const AddBanner = dynamic(() => import('@/components/dashboard/banner/AddBanner'), { ssr: false })
const BannerList = dynamic(() => import('@/components/dashboard/banner/BannerList'), { ssr: false })

export default function Banner() {
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
          className="!h-10 !px-6 !font-medium"
          style={{ borderRadius: "var(--button-border-radius)" }}
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
