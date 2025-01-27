import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../auth/model/user.entity";

@Entity("applied_coupons")
export class AppliedCouponEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "coupon_id" })
  couponId!: number;

  @Column({ name: "order_id" })
  orderId!: number;

  @Column({
    name: "discount_amount",
    type: "numeric",
    precision: 10,
    scale: 2,
  })
  discountAmount!: string;

  @Column({ name: "user_id" })
  userId!: number;
  @ManyToOne((_type) => UserEntity, (user) => user.reviews)
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "applied_at", type: "timestamp" })
  appliedAt?: string;
}
