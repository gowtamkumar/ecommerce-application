import { z } from "zod";

export const settingValidationSchema = z.object({
  companyName: z.string({
    required_error: "Company Name is required",
  }),
  image: z.string().optional(),
  url: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  currencyId: z.number().optional(),
  userId: z.number({
    required_error: "User is required",
  }),
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
