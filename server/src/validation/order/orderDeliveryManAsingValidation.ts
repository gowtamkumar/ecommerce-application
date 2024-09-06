import { z } from "zod";

export const orderDeliveryManValidationSchema = z.object({
  deliveryId: z.number({
    required_error: "Delivery man assign is required",
  }),
});
