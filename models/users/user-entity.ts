import "reflect-metadata";
import { RoleEnum } from "./enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  password?: string;

  @Column()
  email?: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: "bigint", nullable: true })
  resetTokenExpire?: number;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;

  @Column({ type: "boolean", default: true })
  status!: boolean;

  // tesnum!: number
  // getTestNUmber() {
  //   return this.tesnum = 100;
  // }
}
