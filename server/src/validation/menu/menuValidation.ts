import { z } from "zod";

export const menuValidationSchema = z.object({
  name: z.string({
    required_error: "Company Name is required",
  }),
  topBarMenu: z.boolean().optional(),
  mainMenu: z.boolean().optional(),
  footerMenu: z.boolean().optional(),

  userId: z.number({
    required_error: "User is required",
  }),

  items: z.any({
    required_error: "Items is required",
  }),
});
