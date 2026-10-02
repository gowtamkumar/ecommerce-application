"use server";

import appConfig from "@/appConfig";
import { handleResponse } from "@/lib/utils/commonFunctions";

export interface LandingDirectOrderItem {
  productId: number;
  productVariantId: number;
  qty: number;
  unitPrice: number;
  purchasePrice?: number;
  discountedUnitPrice?: number;
  subTotal: number;
  taxAmount?: number;
}

export interface LandingDirectOrderPayload {
  customerName: string;
  phoneNo: string;
  deliveryAddress: string;
  deliveryZone?: string;
  shippingCharge: number;
  subTotal: number;
  grandTotal: number;
  paymentMethod: "Cash" | "SSLCOMMERZ";
  note?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  orderItems: LandingDirectOrderItem[];
}

/**
 * Fetch product details, delivery rates, and store info optimized for the landing page
 */
export async function getLandingProductData(slug: string) {
  try {
    const res = await fetch(`${appConfig.apiUrl}/landing/product/${slug}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse(res);
  } catch (error: any) {
    console.error("Error fetching landing product:", error);
    return {
      success: false,
      message: error?.message || "Failed to load product",
      data: null,
    };
  }
}

/**
 * Direct guest order submission for landing page visitors
 */
export async function submitLandingOrder(payload: LandingDirectOrderPayload) {
  try {
    const res = await fetch(`${appConfig.apiUrl}/landing/order`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (error: any) {
    console.error("Error submitting landing order:", error);
    return {
      success: false,
      message: error?.message || "Failed to submit order. Please try again.",
      data: null,
    };
  }
}
