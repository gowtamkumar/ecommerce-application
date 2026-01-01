"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";



const AddBrand = dynamic(() => import('@/components/dashboard/brand/AddBrand'), { ssr: false })
const BrandList = dynamic(() => import('@/components/dashboard/brand/BrandList'), { ssr: false })

export default function Brand() {
  const dispatch = useDispatch();
  const { Title, Text } = Typography;

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Product Brands
          </Title>
          <Text type="secondary">
            Manage product brands and manufacturers
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                brand:true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Brand
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <BrandList />
      </Card>

      <AddBrand />
    </div>
  );
}
