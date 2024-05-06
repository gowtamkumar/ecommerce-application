import { z } from "zod";

export const productVariantValidationSchema = z.object({
  regularPrice: z.number({ required_error: "Regular Price is required" }),
  salePrice: z.number({ required_error: "Sale Price is required" }),
  sizeId: z.string().optional(),
  sizes: z.string().optional(),
  stockQty: z.number().optional(),
  stockStatus: z.enum(["In Stock", "Out Stock"]).optional(),
});
