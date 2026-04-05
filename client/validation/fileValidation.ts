import { z } from "zod";

export const evnFileValidationSchema = z.object({
  DB_TYPE: z.string({ message: "DB_TYPE is required" }),
  DB_HOST: z.string({
    message: "DB_HOST is required",
  }),
  DB_PORT: z.string({
    message: "DB_PORT is required",
  }),
  DB_USERNAME: z.string({
    message: "DB_HOST is required",
  }),

  DB_PASSWORD: z.string({
    message: "DB_PASSWORD is required",
  }),

  DB_DATABASE: z.string({
    message: "DB_DATABASE is required",
  }),
});
