import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  username!: string;
  password!: string;
  resetToken?: string;
  resetTokenExpire?: number;
  role: any;
  status?: boolean;
}
