import User from "@/components/dashboard/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  description: "This is a User.",
};

export default function page() {
  return <User />;
}
