import Coupon from "@/components/dashboard/coupon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coupon',
  description: 'This is a Coupon',
};

export default function page() {
  return <Coupon />
}
