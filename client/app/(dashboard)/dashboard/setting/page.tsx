import dynamic from "next/dynamic";

const Setting = dynamic(
  () => import("@/components/dashboard/setting"),
);

export default function page() {
  return <Setting />;
}
