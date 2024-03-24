// export interface UpdateUserDto {
//   name: string;
//   username: string;
//   email: string;
//   role: any;
//   status: boolean;
// }

export class UpdateUserDto {
  name!: string;
  username!: string;
  email!: string;
  role: any;
  status!: boolean;
}
