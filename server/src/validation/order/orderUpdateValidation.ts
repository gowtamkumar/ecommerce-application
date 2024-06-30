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
  emailAddress: z.string().optional(),

  paymentStatus: z.enum(["Paid", "NotPaid", "PertialPaid"], {
    required_error: "Payment Status is required",
  }),

  paymentType: z.enum(["Oneline", "Offline"]).optional(),
  status: z.enum(["Processing", "Pending", "Completed", "Failed"]).optional(),
  orderItems: z
    .array(
      z.object({
        // totalAmount: z.number({ required_error: "total Amount is required" }),
        price: z.number({ required_error: "Price is required" }),
        tax: z.number().optional(),
        productId: z.number({ required_error: "Product is required" }),
        qty: z.number({ required_error: "qty is required" }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
});
