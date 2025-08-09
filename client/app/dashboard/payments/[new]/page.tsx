import OrderTracker from "@/components/dashboard/payment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'New Payment',
  description: 'This is a Payment.',
};

export default function page() {
  return <OrderTracker />
}
