import Currency from "@/components/dashboard/currency/Currency";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Currency",
  description: "This is a Currency.",
};

export default function page() {
  return <Currency />;
}
