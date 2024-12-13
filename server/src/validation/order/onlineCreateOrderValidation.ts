import { z } from "zod";

export const onlineCreateOrderValidationSchema = z.object({
  orderDate: z.string({
    required_error: "order Date is required",
  }),
  orderTotalAmount: z.number({
    required_error: "order total Amount is Required",
  }),
  userId: z.number().optional(),
  discountAmount: z.number().optional(),
  netAmount: z.number().optional(),
  orderTax: z.number().optional(),
  shippingAmount: z.number().optional(),
  note: z.string().optional(),
  shippingAddressId: z.number({
    required_error: "Shipping Address is Required",
  }),

  paymentMethod: z.enum(["Cash", "SSLCOMMERZ", "Stripe"], {
    required_error: "Payment Method is Required",
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
        productId: z.number({ required_error: "Product is required" }),
        colorId: z.number().optional().nullable(),
        sizeId: z.number().optional().nullable(),
        unitPrice: z.number({ required_error: "Unit Price is required" }),
        productVariantId: z.number({
          required_error: "Product Variant is required",
        }),
        discountAmount: z.number().optional(),
        purchasePrice: z.number({
          required_error: "Purchase Price is required",
        }),
        taxAmount: z.number({ required_error: "Tax Amount is required" }),
        qty: z.number({ required_error: "qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
