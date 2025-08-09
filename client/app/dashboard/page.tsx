import { Metadata } from "next";
import dynamic from "next/dynamic";

const MainDashboard = dynamic(
  () => import("@/components/dashboard/dashboard/Dashboard")
);

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'This is a Dashboard.',
};

export default function Page() {
  return <MainDashboard />;
}
