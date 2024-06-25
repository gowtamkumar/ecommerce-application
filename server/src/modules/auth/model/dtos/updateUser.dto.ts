import { StatusEnum } from "../../enums/status.enum";

export interface UpdateUserDto {
  name: string;
  username: string;
  email: string;
  role: any;
  status: StatusEnum;
}
