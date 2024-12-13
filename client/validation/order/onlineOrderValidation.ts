import { z } from "zod";

export const onlineOrderValidationSchema = z.object({
  orderDate: z.string({
    required_error: "order Date is required",
  }),
  orderTotalAmount: z.number({
    required_error: "order total Amount is Required",
  }),
  shippingAddressId: z.number({
    required_error: "Shipping Address is Required",
  }),
  discountAmount: z.number().optional(),
  netAmount: z.number().optional(),
  orderTax: z.number().optional(),
  shippingAmount: z.number().optional(),
  note: z.string().optional(),
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
        purchasePrice: z.number({
          required_error: "Purchase Price is required",
        }),
        unitPrice: z.number({ required_error: "Unit Price is required" }),
        taxAmount: z.number({ required_error: "Tax Amount is required" }),
        discountAmount: z.number().optional(),
        id: z.number({ required_error: "cart is required" }),
        productVariantId: z.number({
          required_error: "Product Variant is required",
        }),
        sizeId: z.number().optional().nullable(),
        colorId: z.number().optional().nullable(),
        qty: z.number({ required_error: "Qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
