import Contact from "@/components/dashboard/contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacts",
  description: "Manage contact messages.",
};

export default function page() {
  return <Contact />;
}
