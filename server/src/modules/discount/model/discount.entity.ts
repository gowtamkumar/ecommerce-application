import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntity } from "../../products/product/model/product.entity";
import { DiscountType } from "../../../enums/discount-type.enum";
import { Status } from "../../../enums/status.enum";

@Entity("discounts")
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  name!: string;

  @Column({ name: "discount_type", type: "enum", enum: DiscountType })
  discountType!: DiscountType;

  @Column()
  value!: number;

  @Column({ nullable: true })
  image!: string;

  @Column({ type: "enum", enum: Status, default: Status.Active })
  status!: Status;

  @Column({ name: "user_id" })
  userId?: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  @OneToMany((_type) => ProductEntity, (product) => product.discount)
  products!: ProductEntity[];
}
