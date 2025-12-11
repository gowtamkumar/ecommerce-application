import NotificationList from "@/components/dashboard/notification/NotificationList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Alerts",
  description: "Monitor critical system events and alerts.",
};

export default function page() {
  return <NotificationList />;
}
