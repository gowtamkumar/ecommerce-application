import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { DiscountType } from "../enums/discount-type.enum";
import { DiscountStatus } from "../enums/discount-status.enum";
import { Type } from "../enums";

@Entity("discounts")
export class DiscountEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "discount_type", type: "enum", enum: DiscountType })
  discountType!: DiscountType;

  @Column({ name: "coupon_code", unique: true, nullable: true })
  couponCode!: string;

  @Column({ type: "enum", enum: Type })
  type!: Type;

  @Column()
  value!: number;

  @Column({
    name: "start_date",
    type: "timestamp with time zone",
    nullable: true,
  })
  startDate!: string;

  @Column({
    name: "expiry_date",
    type: "timestamp with time zone",
    nullable: true,
  })
  expiryDate!: string;

  // @Column({ name: "end_date", type: "timestamp" })
  // endDate!: string;

  @Column({ name: "min_order_amount", type: "numeric", nullable: true })
  minOrderAmount!: number;

  @Column({ name: "max_user", nullable: true })
  maxUser!: number;

  @Column({ name: "usage_count", nullable: true })
  usageCount!: number;

  // @Column({ name: "is_single_use", type: "boolean", default: false })
  // isSingleUse!: boolean;

  @Column({
    type: "enum",
    enum: DiscountStatus,
    default: DiscountStatus.Active,
  })
  status!: DiscountStatus;

  @Column({ name: "user_id", nullable: true })
  userId?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
