import Header from "@/components/website/header/Header";
import dynamic from "next/dynamic";
import ScrollToCart from "@/components/share-component/ScrollToCart";
import WhatsAppWidget from "@/components/share-component/WhatsAppWidget";

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

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
      <WebFooter />
    </>
  );
}
