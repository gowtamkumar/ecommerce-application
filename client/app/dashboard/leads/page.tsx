import Lead from "@/components/dashboard/lead/Lead";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads",
  description: "This is a Leads.",
};

export default function page() {
  return <Lead />;
}
