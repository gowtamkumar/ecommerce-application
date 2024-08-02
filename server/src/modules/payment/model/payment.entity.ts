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
import { OrderPaymentMethod } from "../../order/enums";

@Entity("payments")
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id" })
  orderId!: number;
  @ManyToOne((_type) => OrderEntity, (order) => order.payments)
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;

  @Column({ name: "payment_date", type: "timestamp with time zone" })
  paymentDate!: string;

  @Column({
    name: "payment_method",
    type: "enum",
    enum: OrderPaymentMethod,
  })
  paymentMethod!: OrderPaymentMethod;

  @Column({ type: "numeric", precision: 15, scale: 2 })
  amount!: number;

  @Column({ name: "user_id" })
  userId!: number;

  @Column({ type: "boolean", default: true })
  is_successfull!: boolean;

  @Column({ name: "transaction_id", nullable: true })
  transactionId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone" })
  updatedAt?: string;
}
