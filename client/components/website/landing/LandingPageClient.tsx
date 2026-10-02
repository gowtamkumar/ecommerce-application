"use client";

import { trackViewContent } from "@/lib/analytics/metaPixel";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LandingBundleOffers from "./LandingBundleOffers";
import LandingFeatures from "./LandingFeatures";
import LandingGallery from "./LandingGallery";
import LandingHero from "./LandingHero";
import LandingOrderForm from "./LandingOrderForm";
import LandingOrderSuccess from "./LandingOrderSuccess";
import LandingReviews from "./LandingReviews";
import LandingSizeGuide from "./LandingSizeGuide";
import StickyMobileCTA from "./StickyMobileCTA";

interface LandingPageClientProps {
  product: any;
  deliveryCharges?: {
    insideDhaka: number;
    outsideDhaka: number;
  };
  freeDeliveryMinQty?: number | null;
  freeDeliveryMinAmount?: number | null;
  landingSetting?: {
    urgencyText?: string;
    countdownHours?: number;
    ctaButtonText?: string;
    orderFormTitle?: string;
    orderFormSubtitle?: string;
    featuresTitle?: string;
    featuresSubtitle?: string;
    features?: Array<{ title: string; description: string; icon?: string }>;
    bundles?: any[];
    zone1Name?: string;
    zone1Time?: string;
    zone2Name?: string;
    zone2Time?: string;
    sections?: Array<{ slug: string; name?: string; sequence: number; status: boolean }>;
    [key: string]: any;
  };
  storeSetting?: {
    siteName?: string;
    phone?: string;
    whatsapp?: string;
    currency?: string;
  };
}

export default function LandingPageClient({
  product,
  deliveryCharges = { insideDhaka: 60, outsideDhaka: 120 },
  freeDeliveryMinQty = 2,
  freeDeliveryMinAmount = null,
  landingSetting,
  storeSetting,
}: LandingPageClientProps) {
  const searchParams = useSearchParams();

  // Extract UTM parameters
  const utmData = useMemo(
    () => ({
      utmSource: searchParams?.get("utm_source") || undefined,
      utmMedium: searchParams?.get("utm_medium") || undefined,
      utmCampaign: searchParams?.get("utm_campaign") || undefined,
      utmContent: searchParams?.get("utm_content") || undefined,
    }),
    [searchParams],
  );

  const variants = product?.productVariants || [];
  const defaultVariant =
    variants.find((v: any) => v.default || v.isDefault) || variants[0] || {};

  const [selectedVariant, setSelectedVariant] = useState<any>(defaultVariant);
  const [quantity, setQuantity] = useState<number>(1);
  const [placedOrderData, setPlacedOrderData] = useState<any | null>(null);

  // Trigger Meta Pixel ViewContent event on page mount
  useEffect(() => {
    if (product) {
      trackViewContent({
        content_name: product.name,
        content_ids: [selectedVariant?.id || product.id],
        value: Number(selectedVariant?.price || product.finalPrice || product.unitPrice || 0),
        currency: "BDT",
      });
    }
  }, [product, selectedVariant]);

  // Smooth scroll to embedded order form
  const scrollToOrderForm = () => {
    const el = document.getElementById("order-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Extract images
  const images = useMemo(() => {
    const list: string[] = [];
    if (product?.thumbnailImage) list.push(product.thumbnailImage);

    if (typeof product?.images === "string") {
      const splitImgs = product.images.split(",").filter(Boolean);
      list.push(...splitImgs);
    } else if (Array.isArray(product?.images)) {
      list.push(...product.images.filter(Boolean));
    }

    return Array.from(new Set(list));
  }, [product]);

  // Handle size selection from Size Guide
  const handleSizeSelect = (sizeName: string) => {
    const match = variants.find(
      (v: any) =>
        (v.size?.name || v.sizeName || "").toLowerCase() === sizeName.toLowerCase(),
    );
    if (match) {
      setSelectedVariant(match);
      scrollToOrderForm();
    }
  };

  // Dynamic section layout and sequence ordering
  const defaultSections = [
    { slug: "hero", sequence: 1, status: true },
    { slug: "features", sequence: 2, status: true },
    { slug: "bundle_offers", sequence: 3, status: true },
    { slug: "size_guide", sequence: 4, status: true },
    { slug: "reviews", sequence: 5, status: true },
    { slug: "order_form", sequence: 6, status: true },
  ];

  const orderedSections = useMemo(() => {
    const rawSections =
      landingSetting?.sections && Array.isArray(landingSetting.sections) && landingSetting.sections.length > 0
        ? landingSetting.sections
        : defaultSections;

    return [...rawSections]
      .filter((s: any) => s.status !== false)
      .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0));
  }, [landingSetting?.sections]);

  // If order is completed, show Thank You / Success screen
  if (placedOrderData) {
    return (
      <div className="py-10 px-4 sm:px-6">
        <LandingOrderSuccess
          orderData={placedOrderData}
          productName={product?.name || "Product"}
          storePhone={storeSetting?.phone}
          whatsapp={storeSetting?.whatsapp}
        />
      </div>
    );
  }

  const effectiveUnitPrice = Number(
    selectedVariant?.price || product?.finalPrice || product?.unitPrice || 0,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-14">
      {orderedSections.map((sec) => {
        switch (sec.slug) {
          case "hero":
            return (
              <section key="hero" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-6 lg:sticky lg:top-24">
                  <LandingGallery images={images} productName={product?.name || "Product"} />
                </div>
                <div className="lg:col-span-6">
                  <LandingHero
                    product={product}
                    selectedVariant={selectedVariant}
                    onOrderNowClick={scrollToOrderForm}
                    urgencyText={landingSetting?.urgencyText}
                    countdownHours={landingSetting?.countdownHours}
                    ctaButtonText={landingSetting?.ctaButtonText}
                  />
                </div>
              </section>
            );

          case "features":
            return (
              <section key="features">
                <LandingFeatures
                  features={landingSetting?.features}
                  title={landingSetting?.featuresTitle}
                  subtitle={landingSetting?.featuresSubtitle}
                />
              </section>
            );

          case "bundle_offers":
            return (
              <section key="bundle_offers">
                <LandingBundleOffers
                  unitPrice={effectiveUnitPrice}
                  quantity={quantity}
                  freeDeliveryMinQty={freeDeliveryMinQty}
                  customBundles={landingSetting?.bundles}
                  onSelectQuantity={(qty) => {
                    setQuantity(qty);
                    scrollToOrderForm();
                  }}
                />
              </section>
            );

          case "size_guide":
            const hasSizes = variants.some((v: any) => v.size?.name || v.sizeName);
            if (!hasSizes) return null;
            return (
              <section key="size_guide">
                <LandingSizeGuide
                  sizes={variants}
                  selectedSize={selectedVariant?.size?.name || selectedVariant?.sizeName}
                  onSelectSize={handleSizeSelect}
                />
              </section>
            );

          case "reviews":
            return (
              <section key="reviews">
                <LandingReviews
                  reviews={product?.reviews || []}
                  avgRating={product?.avgRating || 5.0}
                />
              </section>
            );

          case "order_form":
            const fullDeliveryCharges = {
              ...deliveryCharges,
              zone1Name: landingSetting?.zone1Name,
              zone1Time: landingSetting?.zone1Time,
              zone2Name: landingSetting?.zone2Name,
              zone2Time: landingSetting?.zone2Time,
            };
            return (
              <section key="order_form">
                <LandingOrderForm
                  product={product}
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onSelectVariant={setSelectedVariant}
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  deliveryCharges={fullDeliveryCharges}
                  freeDeliveryMinQty={freeDeliveryMinQty}
                  freeDeliveryMinAmount={freeDeliveryMinAmount}
                  title={landingSetting?.orderFormTitle}
                  subtitle={landingSetting?.orderFormSubtitle}
                  ctaButtonText={landingSetting?.ctaButtonText}
                  utmData={utmData}
                  onOrderSuccess={(orderData) => {
                    setPlacedOrderData(orderData);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </section>
            );

          default:
            return null;
        }
      })}

      {/* FLOATING MOBILE ORDER CTA */}
      <StickyMobileCTA
        price={effectiveUnitPrice}
        quantity={quantity}
        onOrderClick={scrollToOrderForm}
        ctaButtonText={landingSetting?.ctaButtonText}
      />
    </div>
  );
}
