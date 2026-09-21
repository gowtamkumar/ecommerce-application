import { z } from 'zod';

const optionalString = z.string().optional().nullable();
const optionalBoolean = z.boolean().optional().nullable();

export const categoriesValidationSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  userId: z.number({ required_error: 'User is required' }),
  parentId: z.number().optional().nullable(),
  image: optionalString,
  description: optionalString,
  isFeatured: optionalBoolean,
  active: optionalBoolean,
});

export const updateCategoryValidationSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  parentId: z.number().optional().nullable(),
  image: optionalString,
  description: optionalString,
  isFeatured: optionalBoolean,
  active: optionalBoolean,
});
