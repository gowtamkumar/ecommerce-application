import Category from '@/components/dashboard/category';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Category',
  description: 'This is a Category.',
};


export default function page() {
  return <Category />
}
