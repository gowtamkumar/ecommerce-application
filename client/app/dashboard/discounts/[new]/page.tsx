import AddDiscount from '@/components/dashboard/discount/AddDiscount';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'New Discount',
  description: 'This is a New Discount',
};


export default function Discount() {
  return (
    <AddDiscount />
  )
}
