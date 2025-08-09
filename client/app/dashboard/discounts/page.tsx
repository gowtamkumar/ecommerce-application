import Discount from "@/components/dashboard/discount";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Discount',
  description: 'This is a Discount',
};


export default function page() {
  return <Discount />
}
