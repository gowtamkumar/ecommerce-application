import dynamic from "next/dynamic";

const OtherModule = dynamic(
  () => import("@/components/dashboard/other-modules")
);

export default function page() {
  return <OtherModule />;
}
