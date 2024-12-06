import { z } from "zod";

export const productValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
  slug: z.string({
    required_error: "Slug is required",
  }),
  taxId: z.number({
    required_error: "Tax is required",
  }),
  images: z.array(
    z.string({
      required_error: "Images is required",
    })
  ),
  thumbnailImage: z.string({
    required_error: "Thumbnail Image is required",
  }),
  hoverImage: z.string({
    required_error: "Hover Image is required",
  }),
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
  variant: z.boolean().optional(),
  featured: z.boolean().optional(),
  alertQty: z.number({
    required_error: "Alert Qty is Required",
  }),
  status: z.enum(["Active", "Inactive"]).optional(),

  productVariants: z
    .array(
      z.object({
        salePrice: z.number({ required_error: "Sale Price is required" }),
        purchasePrice: z.number({
          required_error: "Purchase Price is required",
        }),
        default: z.boolean().optional(),
        sizeId: z.number().optional(),
        stockQty: z.number({
          required_error: "Stock Qty is required",
        }),
      })
    )
    .nonempty({ message: "can't be empty!" }),
  productColors: z.array(z.number()).nonempty({ message: "can't be empty!" }),
  productCategories: z
    .array(z.number())
    .nonempty({ message: "can't be empty!" }),
});
