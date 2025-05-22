import type { Metadata } from "next";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOption";
import { getSettings } from "@/lib/apis/setting";
import appConfig from "@/appConfig";
import StoreProvider from "@/redux/storeProvider";
import AuthProvider from "../lib/SessionProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ToastContainer } from "react-toastify";

// Global styles
import "./globals.css";
import "./style.css";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import "@ant-design/v5-patch-for-react-19";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import Head from "next/head";

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
  const session = await getServerSession(authOptions);
  const settingRes = await getSettings();
  const setting = settingRes?.data || {};
  const favicon = setting?.favicon
    ? `${appConfig.baseApiUrl}/uploads/${setting.favicon}`
    : "";

  return (
    <html lang="en">
      <Head>
        {favicon && <link rel="icon" href={favicon} />}
        {renderSeoCode(setting?.seo?.headerCode)}
      </Head>
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
