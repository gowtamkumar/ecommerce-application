"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const AddUnit = dynamic(() => import("@/components/dashboard/unit/AddUnit"), {
  ssr: false,
});
const UnitList = dynamic(() => import("@/components/dashboard/unit/UnitList"), {
  ssr: false,
});

export default function Unit() {
  const dispatch = useDispatch();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Product Units
          </Title>
          <Text type="secondary">Manage measurement units for products</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                unit: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="!bg-black hover:!bg-gray-800 !rounded-xl !h-10 !px-6 !font-medium"
        >
          New Unit
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <UnitList />
      </Card>

      <AddUnit />
    </div>
  );
}
