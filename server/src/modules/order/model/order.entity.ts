import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus, PaymentTypeStatus } from "../enums";
import { OrderItemEntity } from "./order-item.entity";
import { PaymentEntity } from "../../payment/model/payment.entity";
import { OrderTrackingEntity } from "../../order-tracking/model/order-tracking.entity";
import { UserEntity } from "../../auth/model/user.entity";

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

  // @Column({ name: "is_shipped", type: "boolean" })
  // isShipped!: boolean;

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

  // @Column({ name: "net_amount", type: "numeric", precision: 15, scale: 2 })
  // netAmount!: number;

  @Column({
    name: "shiping_amount",
    type: "numeric",
    precision: 15,
    scale: 2,
    nullable: true,
  })
  shipingAmount?: number;

  @Column({ nullable: true })
  note!: string;

  @Column({ name: "phone_no" })
  phoneNo!: string;

  @Column({ name: "email_address", nullable: true })
  emailAddress!: string;

  @Column({ name: "delivery_address", nullable: true })
  deliveryAddress!: string;

  @Column({
    name: "payment_status",
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.Paid,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    name: "payment_type",
    type: "enum",
    enum: PaymentTypeStatus,
    default: PaymentTypeStatus.Online,
  })
  paymentType!: PaymentTypeStatus;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status!: OrderStatus;

  @Column({ name: "user_id", nullable: true })
  userId?: number;
  @ManyToOne((_type) => UserEntity, (user) => user.orders, {
    onDelete: "SET NULL",
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
