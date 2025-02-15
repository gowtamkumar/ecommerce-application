import { z } from "zod";

export const updateMenuValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  topBarMenu: z.boolean().optional(),
  mainMenu: z.boolean().optional(),
  footerMenu: z.boolean().optional(),
  active: z.boolean().optional(),
  items: z.any({
    required_error: "Items is required",
  }),
});
