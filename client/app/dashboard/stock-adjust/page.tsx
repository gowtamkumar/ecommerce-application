import StockAdjust from "@/components/dashboard/other-modules/stock-adjust/StockAdjust";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock Adjust",
  description: "This is a Stock Adjust.",
};

export default function page() {
  return <StockAdjust />;
}
