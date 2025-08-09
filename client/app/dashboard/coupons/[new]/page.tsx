
import { Metadata } from "next";
import dynamic from "next/dynamic";
const AddCoupon = dynamic(
  () => import("@/components/dashboard/coupon/AddCoupon"),
  {
    loading: () => "new Coupon loadding............",
  }
);

export const metadata: Metadata = {
  title: 'New Coupon',
  description: 'This is a New Coupon',
};

export default function Coupon() {
  return <AddCoupon />;
}
