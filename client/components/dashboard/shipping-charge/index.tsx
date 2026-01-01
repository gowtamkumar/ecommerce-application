"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const ShippingChargeList = dynamic(
  () => import("@/components/dashboard/shipping-charge/ShippingChargeList"),
  { ssr: false }
);
const AddShippingCharge = dynamic(
  () => import("@/components/dashboard/shipping-charge/AddShippingCharge"),
  { ssr: false }
);

export default function ShippingCharge() {
  const dispatch = useDispatch();

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={2} className="!mb-1">
            Shipping Charges
          </Title>
          <Text type="secondary">
            Configure shipping charges for different districts
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                type: ActionType.CREATE,
              })
            )
          }
          className="!h-10 !px-6 !font-medium"
          style={{ borderRadius: "var(--button-border-radius)" }}
        >
          New Shipping Charge
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <ShippingChargeList />
      </Card>

      <AddShippingCharge />
    </div>
  );
}
