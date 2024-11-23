import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/website/header/Header"));

const WebFooter = dynamic(() => import("@/components/website/footer/Footer"));

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <WebFooter />
    </div>
  );
}
