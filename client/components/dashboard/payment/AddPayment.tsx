"use client";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

const PaymentList = dynamic(
  () => import("@/components/dashboard/payment/PaymentList"),
  { ssr: false }
);

export default function Payment() {
  const [tabKey, setTabKey] = useState("payment");
  const route = useRouter();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Payment Management
          </Title>
          <Text type="secondary">
            View and manage all payment transactions
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            route.push("/dashboard/payments/new");
          }}
          className="!h-10 !px-6 !font-medium"
          style={{ borderRadius: "var(--button-border-radius)" }}
        >
          New Payment
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <PaymentList />
      </Card>
    </div>
  );
}
