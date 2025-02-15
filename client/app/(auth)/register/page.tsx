import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));
const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Register = dynamic(() => import("@/components/website/register/Register"));


export default function page() {
  return (
    <>
      <Header />
      <Register />
      <WebFooter />
    </>
  )
}
