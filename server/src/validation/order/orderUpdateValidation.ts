import { z } from "zod";

export const orderUpdateValidationSchema = z.object({
  orderDate: z.string({
    required_error: "order Date is required",
  }),
  orderTotalAmount: z.number({
    required_error: "order total Amount is Required",
  }),
  discountAmount: z.number().optional(),
  shippingAmount: z.number().optional(),
  tax: z.number().optional(),
  netAmount: z.number().optional(),
  note: z.string().optional(),
  phoneNo: z.string({
    required_error: "Phone no is Required",
  }),
  email: z.string().optional(),

  paymentStatus: z.enum(["Paid", "NotPaid", "PertialPaid"], {
    required_error: "Payment Status is required",
  }),

  paymentMothod: z.enum(["Oneline", "Offline"]).optional(),
  status: z.enum(["Processing", "Pending", "Completed", "Failed"]).optional(),
  orderItems: z
    .array(
      z.object({
        price: z.number({ required_error: "Price is required" }),
        tax: z.number({ required_error: "Tax is required" }),
        discount: z.number({ required_error: "Discount is required" }),
        productId: z.number({ required_error: "Product is required" }),
        qty: z.number({ required_error: "qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
