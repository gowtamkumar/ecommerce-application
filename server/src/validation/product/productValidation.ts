import { z } from "zod";

export const productValidationSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),

  shippingCost: z.number({
    required_error: "Shipping Cost is required",
  }),
  userId: z.number({
    required_error: "User is required",
  }),
  taxId: z.number({
    required_error: "Tax is required",
  }),
  singleImage: z.string({ required_error: "Single Image is required" }),
  brandId: z.number({
    required_error: "Brand is required",
  }),
  unitId: z.number({
    required_error: "Unit is required",
  }),
  discountId: z.number().optional(),

  limitPurchaseQty: z.number().optional(),
  tags: z.array(z.string()).optional(),

  description: z.string().optional(),
  shortDescription: z.string().optional(),
  enableReview: z.boolean().optional(),
  type: z.enum(["SimpleProduct", "VarientProduct"], {
    required_error: "Product type is required",
  }),

  status: z.enum(["Active", "Inactive"]).optional(),

  productVariants: z
    .array(
      z.object({
        price: z.number({ required_error: "Regular Price is required" }),
        salePrice: z.number({ required_error: "Sale Price is required" }),
        sizeId: z.number().optional(),
        images: z.array(z.string()).optional(),
        colorId: z.number().optional(),
        weight: z.string().optional(),
        stockQty: z.number().optional(),
      })
    )
    .nonempty({ message: "can't be empty!" }),
  productCategories: z
    .array(z.number())
    // .array(
    //   z.object({
    //     categoryId: z.string({ required_error: "Category is required" }),
    //   })
    // )
    .nonempty({ message: "can't be empty!" }),
});
