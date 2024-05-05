import "reflect-metadata";
import { RoleEnum } from "../enums/role.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../product/model/product.entity";
import { TypeEnum } from "../enums";
import { StatusEnum } from "../enums/status.enum";

@Entity("users")
export class UserEntity {
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

  @Column({ type: "enum", enum: TypeEnum, default: TypeEnum.Customer })
  type!: TypeEnum;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ name: "birth_day", nullable: true })
  birthday?: string;

  @Column({ nullable: true })
  point?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ name: "img_url", nullable: true })
  imgUrl?: string;

  @Column({ type: "enum", enum: RoleEnum, default: RoleEnum.User })
  role!: RoleEnum;

  // @Column({ name: "is_admin", type: "boolean", default: false })
  // isAdmin!: boolean;

  @Column({ type: "enum", enum: StatusEnum, default: StatusEnum.Active })
  status!: StatusEnum;

  @Column({ name: "last_login", type: "timestamp", nullable: true })
  lastLogin?: string;

  @Column({ name: "last_logout", type: "timestamp", nullable: true })
  lastLogout?: string;

  @Column({ name: "ip_address", nullable: true })
  ipAddress?: string;

  @Column({ name: "divice_id", nullable: true })
  diviceId?: string;

  @Column({ name: "reset_token", nullable: true })
  resetToken?: string;

  // @Column({ name: "reset_token_expire", type: "bigint", nullable: true })
  // resetTokenExpire?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (product) => product.user)
  products!: ProductEntity[];
}
