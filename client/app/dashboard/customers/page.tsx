"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CustomerList from "@/components/dashboard/customer/CustomerList";

export default function Customer() {
  const session = useSession();

  if (!session) {
    redirect("/login");
  }
  return <CustomerList />;
}
