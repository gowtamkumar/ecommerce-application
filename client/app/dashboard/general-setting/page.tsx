import dynamic from "next/dynamic";
const Index = dynamic(()=> import("@/components/dashboard/general-settings"))

export default function page() {
  return <Index />;
}
