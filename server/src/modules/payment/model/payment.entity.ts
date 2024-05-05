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

@Entity("payments")
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id", nullable: true })
  orderId!: string;
  @ManyToOne((_type) => OrderEntity, (order) => order.payments)
  @JoinColumn({ name: "order_id" })
  order!: OrderEntity;


  @Column()
  date!: string;

  @Column({ name: "payment_method" })
  paymentMethod!: string;

  @Column({ type: "numeric", precision: 15, scale: 2 })
  amount!: number;

  @Column({ name: "user_id", nullable: true })
  userId!: string;


  @Column({ type: "boolean", default: true })
  is_successfull!: boolean;

  @Column({ name: "transaction_id", nullable: true })
  transactionId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt?: string;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt?: string;
}
