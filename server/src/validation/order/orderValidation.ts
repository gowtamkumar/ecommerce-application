import { z } from "zod";

export const orderValidationSchema = z.object({
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
        price: z.string({ required_error: "Price is required" }),
        purchasePrice: z.string({
          required_error: "Purchase Price is required",
        }),
        tax: z.string({ required_error: "Tax is required" }),
        discountA: z.string().optional(),
        id: z.number({ required_error: "Cart id is required" }),
        productId: z.number({ required_error: "Product is required" }),
        productVariantId: z.number({
          required_error: "Product Variant is required",
        }),
        qty: z.number({ required_error: "qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
