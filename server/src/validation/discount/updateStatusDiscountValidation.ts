import { z } from "zod";

export const updateStatusDiscountValidation = z.object({
  status: z.enum(["Active", "Inactive"]).optional(),
});
