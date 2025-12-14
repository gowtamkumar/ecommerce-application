import { z } from 'zod';

export const updateSettingValidationSchema = z.object({
  siteName: z.string().optional(),
  orderFreeShippingAmount: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  helpSupport: z.any().optional(),
  socialLink: z.any().optional(),
  emailConfig: z.any().optional(),
  payment_account: z.any().optional(),
  homePage: z.any().optional(),
  aboutPage: z.any().optional(),
  contactPage: z.any().optional(),
  termPolicyPage: z.any().optional(),
  footerOption: z.any().optional(),
  headerOption: z.any().optional(),
});
