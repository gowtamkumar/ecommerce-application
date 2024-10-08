import { z } from "zod";

export const orderValidationSchema = z.object({
  orderDate: z.string({
    required_error: "order Date is required",
  }),
  orderTotalAmount: z.number({
    required_error: "order total Amount is Required",
  }),
  userId: z.number().optional(),
  shippingAddressId: z.number({
    required_error: "Shipping Address is Required",
  }),
  discountAmount: z.number().optional(),
  netAmount: z.number().optional(),
  orderTax: z.number().optional(),
  shippingAmount: z.number().optional(),
  note: z.string().optional(),
  // phoneNo: z.string({
  //   required_error: "Phone no is Required",
  // }),
  // email: z.string().optional(),
  // paymentStatus: z.enum(["Paid", "NotPaid", "PertialPaid"], {
  //   required_error: "Payment Status is required",
  // }),
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
      "Canceled"
    ])
    .optional(),
  orderItems: z
    .array(
      z.object({
        purchasePrice: z.string({
          required_error: "Purchase Price is required",
        }),
        price: z.string({ required_error: "Price is required" }),
        tax: z.string({ required_error: "Tax is required" }),
        discountA: z.string().optional(),
        id: z.number({ required_error: "cart is required" }),
        productId: z.number({ required_error: "Product is required" }),
        productVariantId: z.number({
          required_error: "Product Variant is required",
        }),
        colorId: z.number().optional().nullable(),
        sizeId: z.number().optional().nullable(),
        qty: z.number({ required_error: "qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
