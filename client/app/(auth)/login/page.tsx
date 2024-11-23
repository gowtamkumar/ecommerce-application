import dynamic from "next/dynamic";

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const Header = dynamic(() => import("@/components/website/header/Header"));
const Login = dynamic(() => import("@/components/website/login/Login"));

export default function page() {
  return (
    <>
      <Header />
      <Login />
      <WebFooter />
    </>
  );
}
