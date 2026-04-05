import { z } from "zod";

export const onlineOrderValidationSchema = z.object({
  totalQty: z.number({
    message: "Qty is Required",
  }),
  subTotal: z.string({
    message: "SubTotal Amount is Required",
  }),
  shippingAddressId: z.number({
    message: "Shipping Address is Required",
  }),
  totalItemsDiscount: z.string().optional(),
  totalTax: z.string().optional(),
  shippingCharge: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["Cash", "SSLCOMMERZ", "Stripe"], {
    message: "Payment Method is Required",
  }),
  grandTotal: z.string({
    message: "Grand Total Amount is Required",
  }),
  couponId: z.union([z.number(), z.null()]).optional(),
  couponDiscount: z.string().optional(),
  termsAndConditions: z.boolean({
    message: "You must accept the terms and conditions",
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
        unitPrice: z.string({ message: "Unit Price is required" }),
        purchasePrice: z.string({
          message: "Purchase Price is required",
        }),
        qty: z.number({ message: "Qty is required" }),

        productId: z.number({
          message: "Product is required",
        }),
        productVariantId: z.number({
          message: "Product Variant is required",
        }),

        discountedUnitPrice: z.string().optional(),
        totalDiscountedPrice: z.string().optional(),
        discountAmountPerUnit: z.string().optional(),
        totalDiscountAmount: z.string().optional(),

        taxAmount: z.string({ message: "Tax Amount is required" }),
        subTotal: z.string({ message: "Sub total is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
