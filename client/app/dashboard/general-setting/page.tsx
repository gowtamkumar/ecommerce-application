import { Metadata } from "next";
import dynamic from "next/dynamic";
const Index = dynamic(() => import("@/components/dashboard/general-settings"))

export const metadata: Metadata = {
  title: 'General Setting',
  description: 'This is a General Setting.',
};

export default function page() {
  return <Index />;
}
