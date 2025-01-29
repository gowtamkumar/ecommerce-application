import { z } from "zod";

export const onlineCreateOrderValidationSchema = z.object({
  totalQty: z.number({
    required_error: "total Qty is Required",
  }),
  subTotal: z.number({
    required_error: "order total Amount is Required",
  }),

  userId: z.number({
    required_error: "User is Required",
  }),
  totalDiscount: z.number().optional(),
  couponDiscount: z.number().optional(),
  shippingCharge: z.number({
    required_error: "Shipping Charge is Required",
  }),
  totalTax: z.number().optional(),
  grandTotal: z.number({
    required_error: "Grand Total is Required",
  }),
  shippingAddressId: z.number({
    required_error: "Shipping Address is Required",
  }),
  paymentMethod: z.enum(["Cash", "SSLCOMMERZ", "Stripe"], {
    required_error: "Payment Method is Required",
  }),
  note: z.string().optional(),
  orderItems: z
    .array(
      z.object({
        qty: z.number({ required_error: "qty is required" }),
        productVariantId: z.number({
          required_error: "Product Variant is required",
        }),
        productId: z.number({ required_error: "Product is required" }),
        unitPrice: z.number({ required_error: "Unit Price is required" }),
        purchasePrice: z.number({
          required_error: "Purchase Price is required",
        }),
        taxAmount: z.number({ required_error: "Tax Amount is required" }),
        discountAmount: z.number().optional(),
        subTotal: z.number({
          required_error: "SubTotal is required",
        }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
