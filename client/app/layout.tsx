import dynamic from "next/dynamic";
import localFont from "next/font/local";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../lib/authOption";
import { getImageUrl } from "@/lib/utils/imageUrl";
import { getSettings } from "@/lib/apis/setting";
import StoreProvider from "@/redux/storeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ToastContainer } from "react-toastify";
import AuthProvider from "../lib/SessionProvider";

// Global styles
import { auth } from "@/auth";
import WhatsAppWidget from "@/components/share-component/WhatsAppWidget";
import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./globals.css";
import "./style.css";

// Dynamically loaded components
const ScrollToTop = dynamic(() => import("@/components/website/ScrollToTop"));
const CookieBanner = dynamic(() => import("@/components/website/CookieBanner"));

// Custom font (Poppins)
const poppinsFont = localFont({
  src: [
    {
      path: "../fonts/Poppins/Poppins-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Poppins/Poppins-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Poppins/Poppins-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Poppins/Poppins-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Poppins/Poppins-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
});

// Metadata (can be overridden per page)

// Helper to inject custom SEO code
const renderSeoCode = (code?: string) =>
  code ? <script dangerouslySetInnerHTML={{ __html: code }} /> : null;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const settingRes = await getSettings();
  const setting = settingRes?.data || {};
  const favicon = getImageUrl(setting?.favicon, "");

  return (
    <html lang="en">
      <head>
        {favicon && <link rel="icon" href={favicon} />}
        {renderSeoCode(setting?.seo?.headerCode)}
      </head>
      <body suppressHydrationWarning className={poppinsFont.variable}>
        {/* Google Tag Manager (noscript) */}
        {setting?.seo?.bodyStartCode && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${setting.seo.bodyStartCode}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <AuthProvider session={session}>
          <StoreProvider>
            <WhatsAppWidget />
            <AntdRegistry>
              {children}
              <ScrollToTop />
              <CookieBanner />
              <ToastContainer />
            </AntdRegistry>
          </StoreProvider>
        </AuthProvider>

        {/* Inject body end code */}
        {renderSeoCode(setting?.seo?.bodyEndCode)}
      </body>
    </html>
  );
}
