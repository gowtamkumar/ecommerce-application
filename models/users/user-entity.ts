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

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  resetTokenExpire?: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;

  @Column({ type: "boolean", default: true })
  status!: boolean;
}
