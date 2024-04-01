import "reflect-metadata";
import { RoleEnum } from "./enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: "reset_token", nullable: true })
  resetToken?: string;

  @Column({ name: "reset_token_expire", type: "bigint", nullable: true })
  resetTokenExpire?: number;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;

  @Column({ name: "is_admin", type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  // tesnum!: number
  // getTestNUmber() {
  //   return this.tesnum = 100;
  // }
}
