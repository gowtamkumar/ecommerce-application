import { z } from "zod";

export const orderValidationSchema = z.object({
  subTotal: z.number({
    message: "order total Amount is Required",
  }),
  shippingAddressId: z.number({
    message: "Shipping Address is Required",
  }),
  discountAmount: z.number().optional(),
  totalTax: z.number().optional(),
  shippingCharge: z.number().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["Cash", "SSLCOMMERZ", "Stripe"], {
    message: "Payment Method is Required",
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
        purchasePrice: z.string({
          message: "Purchase Price is required",
        }),
        price: z.string({ message: "Price is required" }),
        taxAmount: z.string({ message: "Tax is required" }),
        discountAmount: z.string().optional(),
        id: z.number({ message: "cart is required" }),
        productId: z.number({ message: "Product is required" }),
        productVariantId: z.number({
          message: "Product Variant is required",
        }),
        colorId: z.number().optional().nullable(),
        sizeId: z.number().optional().nullable(),
        qty: z.number({ message: "qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
