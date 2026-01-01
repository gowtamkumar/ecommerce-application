"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const AddShippingAddress = dynamic(
  () => import("@/components/dashboard/shipping-address/AddShippingAddress"),
  { ssr: false }
);
const ShippingAddressList = dynamic(
  () => import("@/components/dashboard/shipping-address/ShippingAddressList"),
  { ssr: false }
);

export default function ShippingAddress() {
  const [tabKey, setTabKey] = useState("shipping_address_list");
  const dispatch = useDispatch();

  return (
    <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={2} className="!mb-1">
            Shipping Addresses
          </Title>
          <Text type="secondary">
            Manage customer shipping addresses and delivery locations
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
          New Address
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <ShippingAddressList />
      </Card>

      <AddShippingAddress />
    </div>
  );
}
