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
  const appearance = setting?.appearance || {};

  // Default values for appearance
  const cssVars = {
    "--primary-font": appearance.primaryFont || "var(--font-poppins)",
    "--secondary-font": appearance.secondaryFont || "var(--font-poppins)",
    "--base-font-size": `${appearance.baseFontSize || 16}px`,
    "--p-size": `${appearance.pSize || 16}px`,
    "--h1-size": `${appearance.h1Size || 48}px`,
    "--h2-size": `${appearance.h2Size || 36}px`,
    "--h3-size": `${appearance.h3Size || 24}px`,
    "--button-font-size": `${appearance.buttonFontSize || 14}px`,
    "--button-border-radius": `${appearance.buttonBorderRadius || 8}px`,
    "--button-padding-y": `${appearance.buttonPaddingVertical || 8}px`,
    "--button-padding-x": `${appearance.buttonPaddingHorizontal || 16}px`,
    "--button-font-weight": appearance.buttonFontWeight || 500,
    "--button-primary-color": appearance.buttonPrimaryColor || appearance.primaryColor || "#F7AA0E",
    "--button-hover-color": appearance.buttonHoverColor || appearance.primaryHoverColor || "#e59a0d",
    "--input-padding-y": `${appearance.inputPaddingVertical || 8}px`,
    "--input-padding-x": `${appearance.inputPaddingHorizontal || 12}px`,
    "--input-border-radius": `${appearance.inputBorderRadius || 8}px`,
    "--input-border-color": appearance.inputBorderColor || "#d9d9d9",
    "--global-primary": appearance.primaryColor || "#F7AA0E",
    "--primary-hover": appearance.primaryHoverColor || "#e59a0d",
    "--global-secondary": appearance.secondaryColor || "#000000",
    "--success-color": appearance.successColor || "#52c41a",
    "--warning-color": appearance.warningColor || "#faad14",
    "--error-color": appearance.errorColor || "#ff4d4f",
    "--info-color": appearance.infoColor || "#1890ff",
    "--background-color": appearance.backgroundColor || "#ffffff",
    "--card-background": appearance.cardBackgroundColor || "#ffffff",
    "--link-color": appearance.linkColor || appearance.primaryColor || "#F7AA0E",
    "--global-accent": appearance.accentColor || appearance.primaryColor || "#F7AA0E",
    "--icon-color": appearance.iconColor || appearance.textColor || "#1f2937",
    "--icon-hover-color": appearance.iconHoverColor || appearance.primaryHoverColor || "#e59a0d",
    "--icon-bg": appearance.iconBackgroundColor || "transparent",
    "--icon-hover-bg": appearance.iconHoverBackgroundColor || "rgba(0,0,0,0.05)",
    "--icon-size": `${appearance.iconSize || 18}px`,
    "--topbar-bg": appearance.topBarBg || appearance.secondaryColor || "#000000",
    "--topbar-text": appearance.topBarText || "#ffffff",
    "--header-bg": appearance.headerBg || "#ffffff",
    "--header-text": appearance.headerText || appearance.textColor || "#1f2937",
    "--footer-bg": appearance.footerBg || "#0f172a",
    "--footer-text": appearance.footerText || "#ffffff",
    "--text-color": appearance.textColor || "#1f2937",
  };

  const googleFonts = [
    appearance.primaryFont,
    appearance.secondaryFont,
  ]
    .filter(Boolean)
    .filter((f) => !f.includes("var(--font-poppins)") && !f.includes("system-ui"))
    .map((f) => f.split(",")[0].trim())
    .filter((v, i, a) => a.indexOf(v) === i);

    console.log("appearance", appearance);
    

  return (
    <html lang="en">
      <head>
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
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                ${Object.entries(cssVars)
                .map(([key, value]) => `${key}: ${value};`)
                .join("\n")}
                body {
                  background-color: var(--background-color);
                  color: var(--text-color);
                }
              }
            `,
          }}
        />

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
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily: appearance.secondaryFont || "var(--font-poppins)",
                    fontSize: appearance.baseFontSize || 16,
                    borderRadius: appearance.buttonBorderRadius || 8,
                    colorPrimary: appearance.primaryColor || "#3211ecff",
                    colorPrimaryHover: appearance.primaryHoverColor || "#e59a0d",
                    colorLink: appearance.linkColor || appearance.primaryColor || "#F7AA0E",
                    colorText: appearance.textColor || "#1f2937",
                    colorSuccess: appearance.successColor || "#52c41a",
                    colorWarning: appearance.warningColor || "#faad14",
                    colorError: appearance.errorColor || "#ff4d4f",
                    colorInfo: appearance.infoColor || "#1890ff",
                    colorBgBase: appearance.backgroundColor || "#ffffff",
                    fontSizeHeading1: appearance.h1Size || 48,
                    fontSizeHeading2: appearance.h2Size || 36,
                    fontSizeHeading3: appearance.h3Size || 24,
                  },
                  components: {
                    Button: {
                      fontSize: appearance.buttonFontSize || 14,
                      borderRadius: appearance.buttonBorderRadius || 8,
                      fontWeight: appearance.buttonFontWeight || 500,
                      paddingInline: appearance.buttonPaddingHorizontal || 16,
                      controlHeight: (appearance.buttonPaddingVertical || 8) * 2 + (appearance.buttonFontSize || 14),
                      colorPrimary: appearance.buttonPrimaryColor || appearance.primaryColor || "#3211ecff",
                      colorPrimaryHover: appearance.buttonHoverColor || appearance.primaryHoverColor || "#e59a0d",
                    },
                    Input: {
                      borderRadius: appearance.inputBorderRadius || 8,
                      paddingInline: appearance.inputPaddingHorizontal || 11,
                      colorBorder: appearance.inputBorderColor || "#d9d9d9",
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
