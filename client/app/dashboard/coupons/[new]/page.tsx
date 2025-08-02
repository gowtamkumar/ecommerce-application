
import dynamic from "next/dynamic";
const AddCoupon = dynamic(
  () => import("@/components/dashboard/coupon/AddCoupon"),
  {
    loading: () => "new Coupon loadding............",
  }
);

export default function Coupon() {
  return <AddCoupon />;
}
