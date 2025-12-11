import NotificationList from "@/components/dashboard/notification/NotificationList";
import NotificationSendForm from "@/components/dashboard/notification/NotificationSendForm";
import type { TabsProps } from 'antd';
import { Tabs } from "antd";

export const metadata = {
  title: "Notification Management",
};

export default function NotificationPage() {

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Send Notification',
      children: <div className="max-w-2xl"><NotificationSendForm /></div>,
    },
    {
      key: '2',
      label: 'System Alerts History',
      children: <NotificationList />,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Notification Manager</h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
