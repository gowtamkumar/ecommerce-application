import ShippingCharge from '@/components/dashboard/shipping-charge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Charges',
  description: 'This is a Shipping Charges',
};

export default function page() {
  return <ShippingCharge />
}
