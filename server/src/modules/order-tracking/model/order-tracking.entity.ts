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
import { OrderEntity } from "../../order/model/order.entity";
import { OrderTrackingStatusEnum } from "../enums/order-tracking-status.enum";

@Entity("order_trackings")
export class OrderTrackingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id", nullable: true })
  orderId!: string;
  @ManyToOne((_type) => OrderEntity, (order) => order.orderTrackings,
  { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

  // @Column({ type: "timestamp with time zone" })
  // date!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({
    type: "enum",
    enum: OrderTrackingStatusEnum,
    default: OrderTrackingStatusEnum.OrderPlaced,
  })
  status!: OrderTrackingStatusEnum;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
