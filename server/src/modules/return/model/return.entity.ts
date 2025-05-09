import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductVariantEntity } from "../../products/product-variant/model/product-variant.entity";
import { ReturnStatus } from "../enums/return-status.enum";
@Entity("Returns")
export class ReturnEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "order_id" })
  orderId!: number;
  // @ManyToOne((_type) => OrderEntity, (order) => order.orderItems, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "order_id" })
  // order!: OrderEntity;

  @Column({ name: "product_id" })
  productId!: number;

  @Column()
  reason!: string;

  @Column({ type: "enum", enum: ReturnStatus })
  status!: ReturnStatus;

  @Column({ name: "user_id" })
  userId!: number;

  @CreateDateColumn({ name: "requested_at", type: "timestamptz" })
  requested_at?: string;

  @UpdateDateColumn({ name: "processed_at", type: "timestamptz" })
  processedAt?: string;
}
