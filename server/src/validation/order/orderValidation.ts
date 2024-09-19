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

  // phoneNo: z.string({
  //   required_error: "Phone no is Required",
  // }),
  // email: z.string().optional(),
  // deliveryAddress: z.string({ required_error: "Delivery Address is Required" }),
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
