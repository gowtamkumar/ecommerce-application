import { CurrencyProvider } from "@/context/CurrencyContext";
import { getSettings } from "@/lib/apis/setting";
import { getImageUrl } from "@/lib/utils/imageUrl";
import StoreProvider from "@/redux/storeProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import dynamic from "next/dynamic";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import AuthProvider from "../lib/SessionProvider";
import appConfig from "@/appConfig";
// Global styles
import { auth } from "@/auth";
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
  const setting = settingRes?.data || {};
  const seo = setting?.seo || {};
  const siteName = setting?.siteName || "Store";

  return {
    metadataBase: appConfig.baseUrl
      ? new URL(appConfig.baseUrl)
      : undefined,
    title: {
      default: seo.metaTitle || siteName,
      template: `%s | ${siteName}`,
    },
    description: seo.metaDescription || `Shop at ${siteName}`,
    keywords: seo.metaKeywords || [],
    // Do not set a sitewide canonical — each page owns its own
    openGraph: {
      title: seo.metaTitle || siteName,
      description: seo.metaDescription || `Shop at ${siteName}`,
      type: seo.ogType || "website",
      siteName,
      images: seo.metaImage ? [getImageUrl(seo.metaImage)] : [],
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
      title: seo.metaTitle || siteName,
      description: seo.metaDescription || `Shop at ${siteName}`,
      images: seo.metaImage ? [getImageUrl(seo.metaImage)] : [],
    },
    verification: {
      google: seo.googleSearchConsoleId || undefined,
    },
    robots: {
      index: true,
      follow: true,
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
  const appearance = setting?.appearance || {};

  // Essential appearance tokens only (micro-controls removed site-wide)
  const primaryColor = appearance.primaryColor || "#F7AA0E";
  const primaryHoverColor = appearance.primaryHoverColor || "#e59a0d";
  const secondaryColor = appearance.secondaryColor || "#000000";
  const textColor = appearance.textColor || "#1f2937";
  const backgroundColor = appearance.backgroundColor || "#ffffff";
  const buttonBorderRadius = appearance.buttonBorderRadius || 8;

  const cssVars = {
    "--primary-font": appearance.primaryFont || "var(--font-poppins)",
    "--secondary-font": appearance.secondaryFont || "var(--font-poppins)",
    "--base-font-size": `${appearance.baseFontSize || 16}px`,
    "--button-border-radius": `${buttonBorderRadius}px`,
    "--button-primary-color": primaryColor,
    "--button-hover-color": primaryHoverColor,
    "--button-text-color": "#ffffff",
    "--global-primary": primaryColor,
    "--primary-hover": primaryHoverColor,
    "--global-secondary": secondaryColor,
    "--background-color": backgroundColor,
    "--topbar-bg": appearance.topBarBg || secondaryColor || "#0f172a",
    "--topbar-text": appearance.topBarText || "#ffffff",
    "--header-bg": appearance.headerBg || "#ffffff",
    "--header-text": appearance.headerText || textColor,
    "--footer-bg": appearance.footerBg || "#0f172a",
    "--footer-text": appearance.footerText || "#ffffff",
    "--text-color": textColor,
  };

  const googleFonts = [
    appearance.primaryFont,
    appearance.secondaryFont,
  ]
    .filter(Boolean)
    .filter((f) => !f.includes("var(--font-poppins)") && !f.includes("system-ui"))
    .map((f) => f.split(",")[0].trim())
    .filter((v, i, a) => a.indexOf(v) === i);


  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        {favicon && <link rel="icon" href={favicon} />}

        {googleFonts.length > 0 && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href={`https://fonts.googleapis.com/css2?${googleFonts
                .map((f) => `family=${f.replace(" ", "+")}:wght@400;500;600;700;900`)
                .join("&")}&display=swap`}
              rel="stylesheet"
            />
          </>
        )}

        <style
          key="custom-theme-vars"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
:root {
  ${Object.entries(cssVars)
                .map(([key, value]) => `${key}: ${value};`)
                .join("\n")}
}
body {
  background-color: var(--background-color);
  color: var(--text-color);
}
            `.trim(),
          }}
        />

        {/* Structured Data for SEO */}
        <OrganizationSchema
          name={setting?.siteName || setting?.name || "Store"}
          logo={getImageUrl(setting?.logo || setting?.image, "")}
          description={setting?.seo?.metaDescription || setting?.description}
          email={setting?.email}
          phone={setting?.phone}
          socialLinks={[
            setting?.socialLink?.facebookUrl,
            setting?.socialLink?.twitterUrl,
            setting?.socialLink?.linkedinUrl,
            setting?.socialLink?.instagramUrl,
          ].filter(Boolean)}
        />
        <WebSiteSchema
          name={setting?.siteName || setting?.name || "Store"}
          description={setting?.seo?.metaDescription || setting?.description}
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
      <body className={`${poppinsFont.variable} antialiased`} suppressHydrationWarning>
        {/* Custom body start code */}
        {renderSeoCode(setting?.seo?.bodyStartCode)}

        <AuthProvider session={session}>
          <StoreProvider>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily: appearance.secondaryFont || "var(--font-poppins)",
                    fontSize: appearance.baseFontSize || 16,
                    borderRadius: buttonBorderRadius,
                    colorPrimary: primaryColor,
                    colorPrimaryHover: primaryHoverColor,
                    colorBgTextHover: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1)`,
                    colorText: textColor,
                    colorBgBase: backgroundColor,
                    fontSizeHeading1: 48,
                    fontSizeHeading2: 36,
                    fontSizeHeading3: 24,
                  },
                  components: {
                    Button: {
                      fontSize: 14,
                      borderRadius: buttonBorderRadius,
                      fontWeight: 500,
                      paddingInline: 16,
                      controlHeight: 40,
                      colorPrimary: primaryColor,
                      colorPrimaryHover: primaryHoverColor,
                      colorTextLightSolid: "#ffffff",
                    },
                    Input: {
                      borderRadius: 8,
                      paddingInline: 12,
                      colorBorder: "#d9d9d9",
                    },
                    Typography: {
                      fontFamily: appearance.primaryFont || "var(--font-poppins)",
                    },
                  },
                }}
              >
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
              </ConfigProvider>
            </AntdRegistry>
          </StoreProvider>
        </AuthProvider>

        {/* Inject body end code */}
        {renderSeoCode(setting?.seo?.bodyEndCode)}
      </body>
    </html>
  );
}
