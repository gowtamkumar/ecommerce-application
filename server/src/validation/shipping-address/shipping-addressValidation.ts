import { z } from "zod";

export const shippingAddressValidationSchema = z.object({
  type: z.enum(["Office", "Home"], {
    required_error: "Type is required",
  }),
  userId: z.number({
    required_error: "user is required",
  }),
  name: z.string({
    required_error: "name is required",
  }),
  email: z.string().optional(),
  phoneNo: z.string({
    required_error: "Phone No is required",
  }),
  alternativPhoneNo: z.string().optional(),
  country: z.string({
    required_error: "Country is required",
  }),
  divisionId: z.number({
    required_error: "Division is required",
  }),
  districtId: z.number({
    required_error: "District is required",
  }),
  upazilaId: z.number({
    required_error: "Upazila is required",
  }),
  unionId: z.number({
    required_error: "Upazila is required",
  }),
  address: z.string({
    required_error: "Address is required",
  }),
});
