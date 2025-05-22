import { Metadata } from "next";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Register = dynamic(() => import("@/components/website/register/Register"));

export const metadata: Metadata = {
  title: "Register",
  description: "...",
};

export default function page() {
  return (
    <>
      <Header />
      <Register />
      <WebFooter />
    </>
  )
}
