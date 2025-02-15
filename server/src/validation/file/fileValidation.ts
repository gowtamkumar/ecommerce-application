import { z } from "zod";

export const fileValidationSchema = z.object({
  fieldname: z.string({
    required_error: "field name is required",
  }),
  originalname: z.string().optional(),
  encoding: z.string().optional(),
  mimetype: z.string().optional(),
  destination: z.string().optional(),
  filename: z.string().optional(),
  path: z.string().optional(),
  size: z.string().optional(),
});
