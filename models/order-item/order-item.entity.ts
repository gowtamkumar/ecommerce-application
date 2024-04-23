import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("order_items")
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id" })
  orderId!: string;

  @Column({ name: "total_amount", type: "numeric" })
  totalAmount!: number;

  @Column()
  qty!: number;

  @Column({ name: "product_id" })
  productId!: string;
}
