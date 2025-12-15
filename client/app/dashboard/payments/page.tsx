import Payment from "@/components/dashboard/payment/AddPayment";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: 'Payment list',
  description: 'This is a Payment. list',
};

export default function page() {
  return <Payment />
}
