import { BrandStatus } from "../../enums";

export interface CreateBrandDto {
  name: string;
  status: BrandStatus;
  userId: string;
}
