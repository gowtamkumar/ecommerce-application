import Brand from "@/components/dashboard/brand/Brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands - Dashboard",
  description: "Manage product brands and manufacturers.",
};

export default function BrandPage() {
  return <Brand />;
}

