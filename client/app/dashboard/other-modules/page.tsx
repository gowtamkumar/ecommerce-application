import { Metadata } from "next";
import dynamic from "next/dynamic";

const OtherModule = dynamic(
  () => import("@/components/dashboard/other-modules")
);

export const metadata: Metadata = {
  title: 'Other Module',
  description: 'This is a Other Module.',
};
export default function page() {
  return <OtherModule />;
}
