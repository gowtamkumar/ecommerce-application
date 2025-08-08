import Order from '@/components/dashboard/order';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order',
  description: 'This is a order',
};

export default function page() {
  return <Order />
}
