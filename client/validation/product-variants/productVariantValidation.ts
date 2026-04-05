import { z } from "zod";

export const productVariantValidationSchema = z.object({
  name: z.string({
    message: "name is required",
  }),

  price: z.string({
    message: "price is required",
  }),
  product_id: z.string({
    message: "product is required",
  }),

  size: z.string({
    message: "Size is required",
  }),

  color: z.string({
    message: "color is required",
  }),

  qty: z.number({
    message: "url Slug is required",
  }),
});
