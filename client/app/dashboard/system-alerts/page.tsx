import SystemAlertList from "@/components/dashboard/system-alerts/SystemAlertList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Alerts",
  description: "Monitor critical system events and alerts.",
};

export default function page() {
  return <SystemAlertList />;
}
