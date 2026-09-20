import { z } from 'zod';

export const shippingAddressValidationSchema = z.object({
  id: z.any().optional(),
  type: z.enum(['Office', 'Home'], {
    required_error: 'Type is required',
  }),
  userId: z.number({
    required_error: 'user is required',
  }),
  name: z.string({
    required_error: 'name is required',
  }),
  email: z.string().nullable().optional(),
  phoneNo: z.string({
    required_error: 'Phone No is required',
  }),
  alternativPhoneNo: z.string().nullable().optional(),
  alternativePhoneNo: z.string().nullable().optional(),
  divisionId: z.number({
    required_error: 'Division is required',
  }),
  districtId: z.number({
    required_error: 'District is required',
  }),
  upazilaId: z.number().nullable().optional(),
  unionId: z.number().nullable().optional(),
  address: z.string({
    required_error: 'Address is required',
  }),
  status: z.boolean().optional(),
});
