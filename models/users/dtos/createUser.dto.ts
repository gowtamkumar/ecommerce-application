export interface userCreateDto {
  id: any;
  name: string;
  username: string;
  password: string;
  resetToken?: string;
  resetTokenExpire?: string;
  role: any;
  status: boolean;
}
