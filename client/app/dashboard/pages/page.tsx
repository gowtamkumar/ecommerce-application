import dynamic from "next/dynamic";
const Index = dynamic(()=> import("@/components/dashboard/Pages"))

export default function page() {
  return <Index />;
}
