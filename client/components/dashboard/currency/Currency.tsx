"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const AddCurrency = dynamic(() => import('@/components/dashboard/currency/AddCurrency'), { ssr: false })
const CurrencyList = dynamic(() => import('@/components/dashboard/currency/CurrencyList'), { ssr: false })

export default function Currency() {
  const dispatch = useDispatch();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="!mb-1">
            Currencies
          </Title>
          <Text type="secondary">
            Manage exchange rates and currency symbols
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
          New Currency
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <CurrencyList />
      </Card>

      <AddCurrency />
    </div>
  );
}
