import { z } from "zod";

export const updateMenuValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  items: z.any({
    required_error: "Items is required",
  }),
});
