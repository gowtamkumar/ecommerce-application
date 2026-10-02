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
      {/* 1. TOP SECTION: Gallery & Hero Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <LandingGallery images={images} productName={product?.name || "Product"} />
        </div>
        <div className="lg:col-span-6">
          <LandingHero
            product={product}
            selectedVariant={selectedVariant}
            onOrderNowClick={scrollToOrderForm}
          />
        </div>
      </section>

      {/* 2. FEATURES & VALUE PROPOSITIONS */}
      <section>
        <LandingFeatures />
      </section>

      {/* 3. BUNDLE OFFERS (BUY 2 GET FREE DELIVERY) */}
      <section>
        <LandingBundleOffers
          unitPrice={effectiveUnitPrice}
          quantity={quantity}
          freeDeliveryMinQty={freeDeliveryMinQty}
          onSelectQuantity={(qty) => {
            setQuantity(qty);
            scrollToOrderForm();
          }}
        />
      </section>

      {/* 4. CLOTHING SIZE MEASUREMENT GUIDE */}
      <section>
        <LandingSizeGuide
          sizes={variants}
          selectedSize={selectedVariant?.size?.name || selectedVariant?.sizeName}
          onSelectSize={handleSizeSelect}
        />
      </section>

      {/* 5. CUSTOMER TESTIMONIALS & SOCIAL PROOF */}
      <section>
        <LandingReviews
          reviews={product?.reviews || []}
          avgRating={product?.avgRating || 5.0}
        />
      </section>

      {/* 6. EMBEDDED 1-PAGE INSTANT CHECKOUT FORM */}
      <section>
        <LandingOrderForm
          product={product}
          variants={variants}
          selectedVariant={selectedVariant}
          onSelectVariant={setSelectedVariant}
          quantity={quantity}
          onQuantityChange={setQuantity}
          deliveryCharges={deliveryCharges}
          freeDeliveryMinQty={freeDeliveryMinQty}
          freeDeliveryMinAmount={freeDeliveryMinAmount}
          utmData={utmData}
          onOrderSuccess={(orderData) => {
            setPlacedOrderData(orderData);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>

      {/* 7. FLOATING MOBILE ORDER CTA */}
      <StickyMobileCTA
        price={effectiveUnitPrice}
        quantity={quantity}
        onOrderClick={scrollToOrderForm}
      />
    </div>
  );
}
