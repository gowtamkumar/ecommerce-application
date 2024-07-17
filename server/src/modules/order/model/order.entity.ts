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
import { OrderStatus } from "../enums/order-status.enum";
import { OrderPaymentMethod, PaymentStatus } from "../enums";
import { OrderItemEntity } from "./order-item.entity";
import { PaymentEntity } from "../../payment/model/payment.entity";
import { OrderTrackingEntity } from "../../order-tracking/model/order-tracking.entity";
import { UserEntity } from "../../auth/model/user.entity";
import { ShippingAddressEntity } from "../../shipping-address/model/shipping-address.entity";

@Entity("orders")
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "tracking_no" })
  trackingNo!: string;

  @Column({ name: "order_date" })
  orderDate!: string;

  // @Column({ name: "is_paid", type: "boolean" })
  // isPaid!: boolean;

  @Column({
    name: "order_total_amount",
    type: "numeric",
    precision: 15,
    scale: 2,
  })
  orderTotalAmount!: number;

  @Column({
    name: "discount_amount",
    type: "numeric",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  discountAmount!: number;

  @Column({
    name: "order_tax",
    type: "numeric",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  orderTax!: number;

  @Column({ name: "net_amount", type: "numeric", precision: 15, scale: 2 })
  netAmount!: number;

  @Column({
    name: "shipping_amount",
    type: "numeric",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  shippingAmount?: number;

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

  @Column({ nullable: true })
  note!: string;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.Paid,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    name: "payment_method",
    type: "enum",
    enum: OrderPaymentMethod,
  })
  paymentMethod!: OrderPaymentMethod;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status!: OrderStatus;

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
    (orderDalivery) => orderDalivery.OrderDeliveries,
    {
      onDelete: "SET NULL",
    }
  )
  @JoinColumn({ name: "delivery_id" })
  deliveryMan!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;

  // relations
  // @OneToMany(() => OrderItemEntity, (orderitem) => orderitem.order)
  // orderItems!: OrderItemEntity[];
  @OneToMany((_type) => OrderItemEntity, (product) => product.order)
  orderItems!: OrderItemEntity[];

  @OneToMany((_type) => PaymentEntity, (payment) => payment.order)
  payments!: PaymentEntity[];

  @OneToMany(
    (_type) => OrderTrackingEntity,
    (orderTracking) => orderTracking.order
  )
  orderTrackings!: OrderTrackingEntity[];
}
