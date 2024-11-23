import dynamic from "next/dynamic";
const Index = dynamic(()=> import("@/components/dashboard/website-setting"))

export default function page() {
  return <Index />;
}
