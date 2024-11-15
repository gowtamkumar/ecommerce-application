import { z } from "zod";

export const productValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
  taxId: z.number({
    required_error: "Tax is required",
  }),
  images: z.array(
    z.string({
      required_error: "Images is required",
    })
  ),
  brandId: z.number().optional(),
  unitId: z.number({
    required_error: "Unit is required",
  }),
  discountId: z.number().optional(),
  limitPurchaseQty: z.number().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string({
    required_error: "Description is required",
  }),
  shortDescription: z.string({
    required_error: "Short Description is required",
  }),
  enableReview: z.boolean().optional(),
  type: z.enum(["SimpleProduct", "VarientProduct"], {
    required_error: "Product type is required",
  }),
  alertQty: z.number({
    required_error: "Alert Qty is Required",
  }),
  status: z.enum(["Active", "Inactive"]).optional(),

  productVariants: z
    .array(
      z.object({
        price: z.number({ required_error: "Regular Price is required" }),
        purchasePrice: z.number({
          required_error: "Purchase Price is required",
        }),
        sizeId: z.number().optional(),
        colorId: z.number().optional(),
        weight: z.string().optional(),
        stockQty: z.number({
          required_error: "Stock Qty is required",
        }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
  productCategories: z
    .array(z.number())
    .nonempty({ message: "can't be empty!" }),
});
