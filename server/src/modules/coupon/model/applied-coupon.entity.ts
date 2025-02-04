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
import { OrderEntity } from "../../order/model/order.entity";

@Entity("applied_coupons")
export class AppliedCouponEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "coupon_id" })
  couponId!: number;

  @Column({ name: "order_id" })
  orderId!: number;
  @ManyToOne((_type) => OrderEntity, (item) => item.appliedCouponItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

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
