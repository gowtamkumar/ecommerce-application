import ShippingAddress from '@/components/dashboard/shipping-address';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Shipping Address',
  description: 'This is a Shipping Address.',
};


export default function page() {
  return <ShippingAddress />
}
