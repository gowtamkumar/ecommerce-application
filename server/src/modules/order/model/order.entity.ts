import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "../../auth/model/user.entity";
import { AppliedCouponEntity } from "../../coupon/model/applied-coupon.entity";
import { OrderTrackingEntity } from "../../order-tracking/model/order-tracking.entity";
import { PaymentEntity } from "../../payment/model/payment.entity";
import { ShippingAddressEntity } from "../../shipping-address/model/shipping-address.entity";
import { PaymentMethod, PaymentStatus } from "../enums";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemEntity } from "./order-item.entity";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "tracking_no" })
  trackingNo!: string;

  // @Column({ name: "is_paid", type: "boolean" })
  // isPaid!: boolean;

  @Column({ name: "total_qty" })
  totalQty!: number;

  @Column({
    name: "sub_total",
    type: "numeric",
    precision: 15,
    scale: 2,
  })
  subTotal!: number;

  @Column({
    name: "total_items_discount",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  totalItemsDiscount!: number;

  @Column({
    name: "coupon_discount",
    type: "numeric",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  couponDiscount!: number;

  // // return
  // @Column({ name: "requested_qty", nullable: true })
  // requestedQty!: number;

  // @Column({ name: "approved_qty", nullable: true })
  // approvedQty!: number;

  // @Column({
  //   name: "total_returned",
  //   type: "numeric",
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // totalReturned!: number;

  // @Column({
  //   name: "returned_status",
  //   type: "enum",
  //   enum: ReturnStatus,
  //   nullable: true,
  // })
  // returnedStatus!: ReturnStatus;

  // // refunded
  // @Column({
  //   name: "total_refuned",
  //   type: "numeric",
  //   precision: 10,
  //   scale: 2,
  //   nullable: true,
  // })
  // totalRefuned!: number;

  // @Column({
  //   name: "refund_status",
  //   type: "enum",
  //   enum: RefundStatus,
  //   nullable: true,
  // })
  // refundStatus!: RefundStatus;
  // // refunded end

  @Column({
    name: "total_tax",
    type: "numeric",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  totalTax!: number;

  @Column({
    name: "shipping_charge",
    type: "numeric",
    precision: 15,
    scale: 2,
  })
  shippingCharge?: number;

  @Column({
    name: "grand_total",
    type: "numeric",
    precision: 10,
    scale: 2,
  })
  grandTotal!: number;

  @Column({ name: "shipping_address_id" })
  shippingAddressId?: number;
  @ManyToOne(
    (_type) => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.orders,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "shipping_address_id" })
  shippingAddress!: ShippingAddressEntity;

  @Column({ name: "coupon_id", nullable: true })
  couponId?: number;

  @Column({ name: "cancel_resson", nullable: true })
  cancelResson!: string;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: PaymentStatus,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    name: "payment_method",
    type: "enum",
    enum: PaymentMethod,
  })
  paymentMethod!: PaymentMethod;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status!: OrderStatus;

  @Column({ name: "tran_id", nullable: true })
  tranId?: string;

  @Column({ name: "user_id" })
  userId?: number;
  @ManyToOne((_type) => UserEntity, (user) => user.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "delivery_id", nullable: true })
  deliveryId?: number;
  @ManyToOne(
    (_type) => UserEntity,
    (orderDalivery) => orderDalivery.orderDeliveries,
    {
      onDelete: "SET NULL",
    }
  )
  @JoinColumn({ name: "delivery_id" })
  deliveryMan!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt?: string;

  // relations
  // @OneToMany(() => OrderItemEntity, (orderitem) => orderitem.order)
  // orderItems!: OrderItemEntity[];
  @OneToMany((_type) => OrderItemEntity, (item) => item.order)
  orderItems!: OrderItemEntity[];

  @OneToMany((_type) => AppliedCouponEntity, (item) => item.order)
  appliedCouponItems!: AppliedCouponEntity[];

  @OneToMany((_type) => PaymentEntity, (payment) => payment.order)
  payments!: PaymentEntity[];

  @OneToMany(
    (_type) => OrderTrackingEntity,
    (orderTracking) => orderTracking.order
  )
  orderTrackings!: OrderTrackingEntity[];
}
