/**
 * Meta (Facebook & Instagram) Pixel helper functions
 * Safely triggers client-side events when fbq is loaded.
 */

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export interface PixelEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: (string | number)[];
  content_type?: string;
  value?: number;
  currency?: string;
  num_items?: number;
  order_id?: string | number;
  [key: string]: any;
}

export function trackPixelEvent(
  eventName: string,
  params: PixelEventParams = {},
) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, params);
      if (process.env.NODE_ENV === "development") {
        console.log(`[Meta Pixel] Event: ${eventName}`, params);
      }
    }
  } catch (error) {
    console.warn(`[Meta Pixel] Failed to track ${eventName}:`, error);
  }
}

export function trackViewContent(params: PixelEventParams) {
  trackPixelEvent("ViewContent", {
    currency: "BDT",
    content_type: "product",
    ...params,
  });
}

export function trackInitiateCheckout(params: PixelEventParams) {
  trackPixelEvent("InitiateCheckout", {
    currency: "BDT",
    ...params,
  });
}

export function trackPurchase(params: PixelEventParams) {
  trackPixelEvent("Purchase", {
    currency: "BDT",
    ...params,
  });
}
