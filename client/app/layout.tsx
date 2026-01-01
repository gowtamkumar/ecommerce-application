import { CurrencyProvider } from "@/context/CurrencyContext";
import { getSettings } from "@/lib/apis/setting";
import { getImageUrl } from "@/lib/utils/imageUrl";
import StoreProvider from "@/redux/storeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import AuthProvider from "../lib/SessionProvider";

// Global styles
import { auth } from "@/auth";
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

// SEO Components
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import WebSiteSchema from "@/components/seo/WebSiteSchema";
import { renderSeoCode } from "@/components/seo/renderSeoCode";

// Dynamically loaded components
const ScrollToTop = dynamic(() => import("@/components/share-component/ScrollToTop"));
const CookieBanner = dynamic(() => import("@/components/share-component/CookieBanner"));
const AnnouncementBar = dynamic(() => import("@/components/share-component/AnnouncementBar"));
const MarketingPopup = dynamic(() => import("@/components/share-component/MarketingPopup"));

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

export async function generateMetadata() {
  const settingRes = await getSettings();
  const seo = settingRes?.data?.seo || {};

  return {
    title: seo.metaTitle || "Ecommerce Store",
    description: seo.metaDescription || "Best products online",
    keywords: seo.metaKeywords || [],
    alternates: {
      canonical: seo.canonicalUrl || undefined,
    },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      type: seo.ogType || "website",
      images: seo.metaImage ? [getImageUrl(seo.metaImage)] : [],
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.metaImage ? [getImageUrl(seo.metaImage)] : [],
    },
    verification: {
      google: seo.googleSearchConsoleId,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const settingRes = await getSettings();
  const setting = settingRes?.data || {};
  const favicon = getImageUrl(setting?.favicon);

  return (
    <html lang="en">
      <head>
        {favicon && <link rel="icon" href={favicon} />}

        {/* Structured Data for SEO */}
        <OrganizationSchema
          name={setting?.name || "ecommerce"}
          logo={getImageUrl(setting?.logo, "")}
          description={setting?.description}
          socialLinks={[
            setting?.socialLink?.facebookUrl,
            setting?.socialLink?.twitterUrl,
            setting?.socialLink?.linkedinUrl,
            setting?.socialLink?.instagramUrl,
          ].filter(Boolean)}
        />
        <WebSiteSchema
          name={setting?.name || "ecommerce"}
          description={setting?.description}
        />

        {/* Custom header code (Analytics, etc.) */}
        {renderSeoCode(setting?.seo?.headerCode)}

        {/* Google Analytics */}
        {setting?.seo?.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${setting.seo.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${setting.seo.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}

        {/* Facebook Pixel */}
        {setting?.marketing?.facebookPixelId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${setting.marketing.facebookPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* Google Ads */}
        {setting?.marketing?.googleAdsId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${setting.marketing.googleAdsId}');
              `,
            }}
          />
        )}
      </head>
      <body className={`${poppinsFont.variable} antialiased`}>
        {/* Custom body start code */}
        {renderSeoCode(setting?.seo?.bodyStartCode)}

        <AuthProvider session={session}>
          <StoreProvider>
            <AntdRegistry>
              <CurrencyProvider>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                />
                <AnnouncementBar marketing={setting?.marketing} />
                <ScrollToTop />

                {children}
                <CookieBanner />
                <MarketingPopup marketing={setting?.marketing} />
              </CurrencyProvider>
            </AntdRegistry>
          </StoreProvider>
        </AuthProvider>

        {/* Inject body end code */}
        {renderSeoCode(setting?.seo?.bodyEndCode)}
      </body>
    </html>
  );
}
