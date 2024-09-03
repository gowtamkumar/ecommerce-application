import WebFooter from "@/components/website/Footer";
import Header from "@/components/website/header/Header";

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
