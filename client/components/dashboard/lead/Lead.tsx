"use client";
import { ActionType } from "@/constants/constants";
import { setAction } from "@/redux/features/global/globalSlice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import dynamic from 'next/dynamic';
import { useState } from "react";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography;

const AddLead = dynamic(()=> import('./AddLead'), {ssr: false})
const LeadList = dynamic(()=> import('./LeadList'), {ssr: false})

export default function Lead() {
  const [tabKey, setTabKey] = useState("lead_list");
  const dispatch = useDispatch();

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Title level={3} className="mb-1">
            Leads Management
          </Title>
          <Text type="secondary">
            Manage customer leads and email subscriptions
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() =>
            dispatch(
              setAction({
                lead: true,
                type: ActionType.CREATE,
              })
            )
          }
          className="h-10 px-6 font-medium"
          style={{ borderRadius: "var(--button-border-radius)" }}
        >
          New Lead
        </Button>
      </div>

      {/* Table Card */}
      <Card className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <LeadList />
      </Card>

      <AddLead />
    </div>
  );
}
