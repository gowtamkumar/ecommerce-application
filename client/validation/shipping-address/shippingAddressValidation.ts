import { z } from "zod";

export const shippingAddressValidationSchema = z.object({
  type: z.enum(["Office", "Home"], {
    message: "Type is required",
  }),
  userId: z.number({
    message: "user is required",
  }),
  name: z.string({
    message: "name is required",
  }),
  email: z.string().optional(),
  phoneNo: z.string({
    message: "Phone No is required",
  }),
  alternativPhoneNo: z.string().optional(),
  divisionId: z.number({
    message: "Division is required",
  }),
  districtId: z.number({
    message: "District is required",
  }),
  upazilaId: z.number().optional(),
  unionId: z.number().optional(),
  address: z.string({
    message: "Address is required",
  }),
});
