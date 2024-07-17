import { z } from "zod";

export const orderStatusUpdateValidationSchema = z.object({
  status: z.enum(
    [
      "Processing",
      "Approved",
      "On Shipping",
      "Shipped",
      "Completed",
      "Pending",
      "Returned",
    ],
    { required_error: "Order Status is Required" }
  ),
});
