import { z } from 'zod';

export const discountValidation = z.object({
  name: z.string({
    required_error: 'name is required',
  }),
  scope: z.enum(['Global', 'Product', 'Products', 'Category', 'Brand'], {
    required_error: 'Scope is required',
  }),
  promotionType: z.enum(['Discount', 'Offer', 'FlashSale', 'Seasonal'], {
    required_error: 'Promotion Type is required',
  }),
  discountStrategy: z.enum(['Percentage', 'Fixed', 'FreeShipping', 'Bogo', 'FreeGift'], {
    required_error: 'Discount Strategy is required',
  }),
  offerDetails: z.record(z.any()).optional(),
  value: z.number({
    required_error: 'value is required',
  }),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  priority: z.number().nullable().optional(),
  stackable: z.boolean().optional(),
  image: z.string().optional(),
  userId: z.number({
    required_error: 'user is required',
  }),
  status: z.enum(['Active', 'Inactive']).optional(),
  description: z.string().optional(),
  applicableProducts: z.array(z.number()).optional(),
  applicableCategories: z.array(z.number()).optional(),
  applicableBrands: z.array(z.number()).optional(),
});
