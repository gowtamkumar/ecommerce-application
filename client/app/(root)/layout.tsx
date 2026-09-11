import ScrollToCart from "@/components/share-component/ScrollToCart";
import WhatsAppWidget from "@/components/share-component/WhatsAppWidget";
import Header from "@/components/website/header/Header";
import dynamic from "next/dynamic";

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));
const ModalLogin = dynamic(() => import("@/components/website/login/ModalLogin"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <WhatsAppWidget />
      <ScrollToCart />
      <ModalLogin />
      <WebFooter />
    </>
  );
}
