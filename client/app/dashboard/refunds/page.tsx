import RefundList from "@/components/dashboard/refund/RefundList";
import BreadCrumb from "@/components/dashboard/BreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Management",
  description: "Manage manual refunds for product returns.",
};

export default function RefundsPage() {
  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <BreadCrumb />
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Refund Management</h1>
          <p className="text-gray-500 mt-1">
            Track and process manual refunds for approved product returns.
          </p>
        </div>
      </div>
      
      <RefundList />
    </div>
  );
}
