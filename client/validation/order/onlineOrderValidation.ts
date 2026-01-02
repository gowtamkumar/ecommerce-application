import { z } from "zod";

export const onlineOrderValidationSchema = z.object({
  totalQty: z.number({
    required_error: "Qty is Required",
  }),
  subTotal: z.string({
    required_error: "SubTotal Amount is Required",
  }),
  shippingAddressId: z.number({
    required_error: "Shipping Address is Required",
  }),
  totalItemsDiscount: z.string().optional(),
  totalTax: z.string().optional(),
  shippingCharge: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["Cash", "SSLCOMMERZ", "Stripe"], {
    required_error: "Payment Method is Required",
  }),
  grandTotal: z.string({
    required_error: "Grand Total Amount is Required",
  }),
  couponId: z.union([z.number(), z.null()]).optional(),
  couponDiscount: z.string().optional(),
  termsAndConditions: z.boolean({
    required_error: "You must accept the terms and conditions",
  }),
  status: z
    .enum([
      "Processing",
      "Approved",
      "On Shipping",
      "Shipped",
      "Completed",
      "Pending",
      "Returned",
      "Canceled",
    ])
    .optional(),
  orderItems: z
    .array(
      z.object({
        unitPrice: z.string({ required_error: "Unit Price is required" }),
        purchasePrice: z.string({
          required_error: "Purchase Price is required",
        }),
        qty: z.number({ required_error: "Qty is required" }),

        productId: z.number({
          required_error: "Product is required",
        }),
        productVariantId: z.number({
          required_error: "Product Variant is required",
        }),

        discountedUnitPrice: z.string().optional(),
        totalDiscountedPrice: z.string().optional(),
        discountAmountPerUnit: z.string().optional(),
        totalDiscountAmount: z.string().optional(),

        taxAmount: z.string({ required_error: "Tax Amount is required" }),
        subTotal: z.string({ required_error: "Sub total is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
